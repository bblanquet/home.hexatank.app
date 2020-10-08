import { IAppService } from '../../../Services/App/IAppService';
import { INetworkService } from '../../../Services/Network/INetworkService';
import { IHostingService } from '../../../Services/Hosting/IHostingService';
import { Component, h } from 'preact';
import { route } from 'preact-router';
import { PacketKind } from '../../../Network/Message/PacketKind';
import PlayersComponent from './Players/PlayersComponent';
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
import { ColorKind } from '../../Common/Button/Stylish/ColorKind';
import Icon from '../../Common/Icon/IconComponent';

export default class HostingComponent extends Component<any, HostState> {
	private _hasSettings: boolean = false;

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

			//map, loaded, start should be in a service...
			new NetworkObserver(PacketKind.Map, this.HandleMap.bind(this)),
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
				{SpriteProvider.IsLoaded() ? (
					<ToastComponent socket={this._socket} Player={this.state.Player}>
						<PanelComponent>
							{this.GetUpdsideButton()}
							<PlayersComponent Socket={this._socket} HostState={this.state} />
							{this.GetDownsideButton()}
							{this._hasSettings ? <OptionComponent Update={this.Update.bind(this)} /> : ''}
						</PanelComponent>
					</ToastComponent>
				) : (
					''
				)}
			</Redirect>
		);
	}

	private PeerConnectionChanged(obj: any, peer: PeerSocket): void {
		if (peer) {
			const player = this.state.Players.Get(peer.GetRecipient());
			if (player) {
				player.Connection = peer.GetConnectionStatus();
				this.setState({});
			}
		}
	}
	private Update(iaNumber: number): void {
		this._hasSettings = false;
		this.setState({
			IaNumber: iaNumber
		});
	}

	private GetDownsideButton() {
		return (
			<div class="container-center-horizontal">
				<ButtonComponent callBack={() => this.Back()} color={ColorKind.Black}>
					<Icon Value="fas fa-undo-alt" /> Back
				</ButtonComponent>
				{this.state.IsAdmin ? (
					<ButtonComponent callBack={() => this.Loading()} color={ColorKind.Red}>
						<Icon Value="far fa-play-circle" /> Start
					</ButtonComponent>
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
				<ButtonComponent color={ColorKind.Black} callBack={() => this.ChangeReady()}>
					<Icon Value="fas fa-toggle-on" /> {this.state.Player.IsReady ? 'Ok' : 'Nok'}
				</ButtonComponent>
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
			const hqCount = +this.state.IaNumber + this.state.Players.Count();
			const mapContext = new MapGenerator().GetMapDefinition(12, 'Flower', hqCount, MapEnv.forest);
			mapContext.PlayerName = this.state.Player.Name;
			this.AssignHqToPlayer(mapContext, this.state.Players.Values());
			this.SetIa(mapContext);
			this.Load(mapContext);
			this._socket.EmitAll<MapContext>(PacketKind.Map, mapContext);
		}
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
		this._networkService.Register(this._socket, this._gameContextService.Publish(), this.state.Players.Values());
		this.state.Player.IsLoaded = true;
		this._socket.EmitAll<boolean>(PacketKind.Loaded, true);
	}

	private HandleStart(data: NetworkMessage<any>): void {
		route('/Canvas', true);
	}

	private HandleLoaded(data: NetworkMessage<boolean>): void {
		this.state.Players.Get(data.Emitter).IsLoaded = data.Content;
		if (this.state.IsAdmin && this.state.Players.Values().every((p) => p.IsLoaded)) {
			this._socket.EmitAll<any>(PacketKind.Start, {});
			route('/Canvas', true);
		}
	}

	private HandleMap(data: NetworkMessage<MapContext>): void {
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
			this.state.Players.Get(message.Emitter).Latency = message.Content;
			this.setState({});
		}
	}

	private Back(): void {
		this._socket.Stop();
		route('/Home', true);
	}
}
