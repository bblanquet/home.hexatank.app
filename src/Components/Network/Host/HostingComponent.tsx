import { IAppService } from '../../../Services/App/IAppService';
import { INetworkService } from '../../../Services/Network/INetworkService';
import { IHostingService } from '../../../Services/Hosting/IHostingService';
import { Component, h } from 'preact';
import { route } from 'preact-router';
import { PacketKind } from '../../../Network/Message/PacketKind';
import PendingPlayers from './Players/PendingPlayersComponent';
import LoadingPlayers from './Players/LoadingPlayersComponent';
import { NetworkObserver } from '../../../Network/NetworkObserver';
import { NetworkSocket } from '../../../Network/NetworkSocket';
import { PeerSocket } from '../../../Network/Peer/PeerSocket';
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';
import { Player } from '../../../Network/Player';
import OptionComponent from './Options/OptionComponent';
import ToastComponent from './../../Common/Toast/ToastComponent';
import { HostState } from '../HostState';
import { MapGenerator } from '../../../Core/Setup/Generator/MapGenerator';
import { MapEnv } from '../../../Core/Setup/Generator/MapEnv';
import { MapContext } from '../../../Core/Setup/Generator/MapContext';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';
import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { Factory, FactoryKey } from '../../../Factory';
import PanelComponent from '../../Common/Panel/PanelComponent';
import Redirect from '../../Redirect/RedirectComponent';
import { SpriteProvider } from '../../../Core/Framework/SpriteProvider';
import ButtonComponent from '../../Common/Button/Stylish/ButtonComponent';
import Visible from '../../Common/Visible/VisibleComponent';
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';
import ActiveButtonComponent from '../../Common/Button/Stylish/ActiveButtonComponent';
import * as moment from 'moment';
import { MapSetting } from '../../Form/MapSetting';
import { MapType } from '../../../Core/Setup/Generator/MapType';

export default class HostingComponent extends Component<any, HostState> {
	private _hasSettings: boolean = false;
	private _isLoading: boolean = false;

	private _appService: IAppService;
	private _hostingService: IHostingService;
	private _networkService: INetworkService;
	private _gameContextService: IGameContextService;

	private _socket: NetworkSocket;
	private _observers: NetworkObserver[];

	constructor(props: any) {
		super(props);

		if (!SpriteProvider.IsLoaded()) {
			return;
		}

		this._appService = Factory.Load<IAppService>(FactoryKey.App);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._gameContextService = Factory.Load<IGameContextService>(FactoryKey.GameContext);
		this._hostingService = Factory.Load<IHostingService>(FactoryKey.Hosting);

		const model = this._hostingService.Publish();
		this.setState(model);

		this._observers = [
			new NetworkObserver(PacketKind.Ready, this.HandleReady.bind(this)),
			new NetworkObserver(PacketKind.Players, this.HandlePlayers.bind(this)),
			new NetworkObserver(PacketKind.Ping, this.HandlePing.bind(this)),
			new NetworkObserver(PacketKind.TimeOut, this.HandleTimeout.bind(this)),

			//map, loaded, start should be in a service...
			new NetworkObserver(PacketKind.Map, this.HandleMap.bind(this)),
			new NetworkObserver(PacketKind.Loading, this.HandleLoading.bind(this)),
			new NetworkObserver(PacketKind.Loaded, this.HandleLoaded.bind(this)),
			new NetworkObserver(PacketKind.Start, this.HandleStart.bind(this))
		];

		this._socket = new NetworkSocket(model.Player.Name, model.RoomName, model.IsAdmin);
		this._observers.forEach((obs) => {
			this._socket.OnReceived.On(obs);
		});
		this._socket.OnPeerConnectionChanged.On(this.PeerConnectionChanged.bind(this));
	}

	componentWillUnmount() {
		if (this.state.IsAdmin) {
			this._socket.EmitServer<any>(PacketKind.Hide, {});
		}
		if (this._observers) {
			this._observers.forEach((obs) => {
				this._socket.OnReceived.Off(obs);
			});
		}

		if (this._socket) {
			this._socket.OnPeerConnectionChanged.Clear();
		}
	}

	render() {
		return (
			<Redirect>
				<Visible isVisible={SpriteProvider.IsLoaded()}>
					<Visible isVisible={this._isLoading}>
						<ToastComponent socket={this._socket} Player={this.state.Player}>
							<PanelComponent>
								<LoadingPlayers Socket={this._socket} HostState={this.state} />
								{this.GetBack()}
							</PanelComponent>
						</ToastComponent>
					</Visible>
					<Visible isVisible={!this._isLoading}>
						<Visible isVisible={this._hasSettings}>
							<OptionComponent Update={this.Update.bind(this)} Model={this.state.MapSetting} />
						</Visible>
						<Visible isVisible={!this._hasSettings}>
							<ToastComponent socket={this._socket} Player={this.state.Player}>
								<PanelComponent>
									{this.GetUpdsideButton()}
									<PendingPlayers Socket={this._socket} HostState={this.state} />
									{this.GetDownsideButton()}
								</PanelComponent>
							</ToastComponent>
						</Visible>
					</Visible>
				</Visible>
			</Redirect>
		);
	}

	private PeerConnectionChanged(obj: any, peer: PeerSocket): void {
		if (peer) {
			const player = this.state.Players.Get(peer.GetRecipient());
			if (player) {
				player.SetConnection(peer.GetConnectionStatus());
				this.setState({});
			}
		}
	}
	private Update(model: MapSetting): void {
		this._hasSettings = false;
		this.setState({
			MapSetting: model
		});
	}

	private GetBack() {
		return (
			<div class="container-center-horizontal">
				<ButtonComponent callBack={() => this.Back()} color={ColorKind.Black}>
					<Icon Value="fas fa-undo-alt" /> Back
				</ButtonComponent>
			</div>
		);
	}

	private GetDownsideButton() {
		return (
			<div class="container-center-horizontal">
				<ButtonComponent callBack={() => this.Back()} color={ColorKind.Black}>
					<Icon Value="fas fa-undo-alt" /> Back
				</ButtonComponent>
				{this.state.IsAdmin ? (
					<ActiveButtonComponent
						left={
							<span>
								<Icon Value={'far fa-play-circle'} /> START
							</span>
						}
						right={
							<span>
								<Icon Value={'far fa-play-circle'} /> START
							</span>
						}
						leftColor={ColorKind.Red}
						rightColor={ColorKind.Gray}
						callBack={() => this.Loading()}
						isActive={this.state.Players.Values().every((e) => e.IsReady)}
					/>
				) : (
					''
				)}
			</div>
		);
	}

	private GetUpdsideButton() {
		return (
			<div class="container-center-horizontal">
				{this.state.IsAdmin ? (
					<ButtonComponent
						callBack={() => {
							this._hasSettings = true;
							this.setState({});
						}}
						color={ColorKind.Black}
					>
						<Icon Value="fas fa-cog" /> Setup
					</ButtonComponent>
				) : (
					''
				)}

				<ActiveButtonComponent
					left={
						<span>
							<Icon Value={'fas fa-toggle-on'} /> ON
						</span>
					}
					right={
						<span>
							<Icon Value={'fas fa-toggle-off'} /> OFF
						</span>
					}
					leftColor={ColorKind.Gray}
					rightColor={ColorKind.Green}
					callBack={() => this.ChangeReady()}
					isActive={this.state.Player.IsReady}
				/>
			</div>
		);
	}

	private ChangeReady(): void {
		const player = this.state.Player;
		player.IsReady = !player.IsReady;
		this.setState({});
		this._socket.EmitAll<boolean>(PacketKind.Ready, player.IsReady);
	}

	private Loading(): void {
		if (this.state.Players.Values().every((e) => e.IsReady)) {
			this._socket.EmitAll<any>(PacketKind.Loading, {});
			this.SetLoading();
			setTimeout(() => {
				let hqCount = +this.state.MapSetting.IaCount + this.state.Players.Count();
				if (this.ConvertSize() === 8 && 3 < hqCount) {
					this.state.MapSetting.Size = 'Large';
				} else if (this.ConvertSize() === 8 && 2 < hqCount) {
					this.state.MapSetting.Size = 'Medium';
				}
				const mapContext = new MapGenerator().GetMapDefinition(
					this.ConvertSize(),
					this.ConvertMapType(),
					hqCount,
					this.ConvertEnv()
				);
				mapContext.PlayerName = this.state.Player.Name;
				this.AssignHqToPlayer(mapContext, this.state.Players.Values());
				this.SetIa(mapContext);
				this.Load(mapContext);
				this._socket.EmitAll<MapContext>(PacketKind.Map, mapContext);
			}, 10);
		}
	}

	private ConvertMapType(): MapType {
		if (this.state.MapSetting.MapType === 'Flower') return MapType.Flower;
		if (this.state.MapSetting.MapType === 'Donut') return MapType.Donut;
		if (this.state.MapSetting.MapType === 'Cheese') return MapType.Cheese;
		if (this.state.MapSetting.MapType === 'Triangle') return MapType.Triangle;
		if (this.state.MapSetting.MapType === 'Y') return MapType.Y;
		if (this.state.MapSetting.MapType === 'H') return MapType.H;
		if (this.state.MapSetting.MapType === 'X') return MapType.X;
		return MapType.Rectangle;
	}

	private ConvertSize(): number {
		if (this.state.MapSetting.Size === 'Small') return 8;
		if (this.state.MapSetting.Size === 'Medium') return 10;
		if (this.state.MapSetting.Size === 'Large') return 12;
		return 8;
	}

	private ConvertEnv(): MapEnv {
		if (this.state.MapSetting.Env === 'Sand') return MapEnv.sand;
		if (this.state.MapSetting.Env === 'Forest') return MapEnv.forest;
		if (this.state.MapSetting.Env === 'Ice') return MapEnv.ice;
		return MapEnv.forest;
	}

	public SetIa(mapContext: MapContext): void {
		let index = 0;
		mapContext.Hqs.forEach((hq) => {
			if (isNullOrUndefined(hq.PlayerName)) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
	}

	public AssignHqToPlayer(mapContext: MapContext, players: Player[]): void {
		if (mapContext.Hqs.length < players.length) {
			throw new Error('not enough hq');
		}
		mapContext.Hqs.forEach((hq, index) => {
			if (index < players.length) {
				mapContext.Hqs[index].PlayerName = players[index].Name;
			}
		});
	}

	private Load(mapContext: MapContext) {
		this._appService.Register(mapContext);
		const context = this._gameContextService.Publish();
		context.Players = this.state.Players.Values();
		this._networkService.Register(this._socket, context);
		this.state.Player.IsLoaded = true;
		this._socket.EmitAll<boolean>(PacketKind.Loaded, true);
	}

	private HandleStart(data: NetworkMessage<any>): void {
		route('/Canvas', true);
	}

	private HandleLoading(data: NetworkMessage<any>): void {
		this.SetLoading();
	}

	private SetLoading(): void {
		this._isLoading = true;
		this.setState({});
	}

	private HandleLoaded(data: NetworkMessage<boolean>): void {
		this.state.Players.Get(data.Emitter).IsLoaded = data.Content;
		if (this.state.IsAdmin && this.state.Players.Values().every((p) => p.IsLoaded)) {
			this._socket.EmitAll<any>(PacketKind.Start, {});
			route('/Canvas', true);
		}
	}

	private HandleMap(data: NetworkMessage<MapContext>): void {
		this.setState({});
		const mapContext = data.Content;
		mapContext.PlayerName = this.state.Player.Name;
		mapContext.Hqs.forEach((hq) => {
			hq.isIa = false;
		});
		this.Load(mapContext);
	}

	//should be kept
	private HandlePlayers(message: NetworkMessage<string[]>): void {
		message.Content.forEach((playerName) => {
			if (!this.state.Players.Exist(playerName)) {
				this.state.Players.Add(playerName, new Player(playerName));
			}
		});

		this.state.Players.Keys().filter((p) => message.Content.indexOf(p) === -1).forEach((c) => {
			if (this.state.Player.Name === c) {
				this.Back();
			} else {
				this.state.Players.Remove(c);
			}
		});

		this.setState({});
	}

	private HandleReady(data: NetworkMessage<boolean>): void {
		if (this.state.Players.Exist(data.Emitter)) {
			this.state.Players.Get(data.Emitter).IsReady = data.Content;
			this.setState({});
		}
	}

	private HandlePing(message: NetworkMessage<string>): void {
		if (this.state.Players.Exist(message.Emitter)) {
			this.state.Players.Get(message.Emitter).SetLatency(message.Content);
			this.setState({});
		}
	}

	private HandleTimeout(message: NetworkMessage<boolean>): void {
		if (this.state.Players.Exist(message.Emitter)) {
			this.state.Players.Get(message.Emitter).SetTimeOut(message.Content);
			this.setState({});
		}
	}

	private Back(): void {
		this._socket.Stop();
		route('/Home', true);
	}
}
