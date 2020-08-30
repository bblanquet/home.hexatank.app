import { Component, h } from 'preact';
import { route } from 'preact-router';
import linkState from 'linkstate';
import * as toastr from 'toastr';
import { PacketKind } from '../../../Network/Message/PacketKind';
import PlayersComponent from './Players/PlayersComponent';
import { NetworkObserver } from '../../../Network/NetworkObserver';
import { Dictionnary } from '../../../Core/Utils/Collections/Dictionnary';
import { NetworkSocket } from '../../../Network/NetworkSocket';
import { PeerSocket } from '../../../Network/Peer/PeerSocket';
import { NetworkMessage } from '../../../Network/Message/NetworkMessage';
import { Player } from '../../../Network/Player';
import OptionComponent from './Options/OptionComponent';
import { IconProvider } from '../../IconProvider';
import { HostState } from '../HostState';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import { ComponentsHelper } from '../../ComponentsHelper';
import { MapGenerator } from '../../../Core/Setup/Generator/MapGenerator';
import { MapMode } from '../../../Core/Setup/Generator/MapMode';
import { MapContext } from '../../../Core/Setup/Generator/MapContext';
import { GameContext } from '../../../Core/Framework/GameContext';
import { GameHelper } from '../../../Core/Framework/GameHelper';

export default class HostingComponent extends Component<any, HostState> {
	private _socket: NetworkSocket;
	private _isFirstRender = true;
	private _hasSettings: boolean = false;

	private _readyObserver: NetworkObserver;
	private _toastObserver: NetworkObserver;
	private _contextObserver: NetworkObserver;
	private _playersObserver: NetworkObserver;
	private _pingObserver: NetworkObserver;
	private _mapObserver: NetworkObserver;

	private _onPeerConnectionChanged: any;
	constructor(props: any) {
		super(props);
		this._readyObserver = new NetworkObserver(PacketKind.Ready, this.OnPlayerReadyChanged.bind(this));
		this._toastObserver = new NetworkObserver(PacketKind.Toast, this.OnToastReceived.bind(this));
		this._contextObserver = new NetworkObserver(PacketKind.Context, this.OnStarted.bind(this));
		this._playersObserver = new NetworkObserver(PacketKind.Players, this.OnPlayersChanged.bind(this));
		this._pingObserver = new NetworkObserver(PacketKind.Ping, this.OnPingChanged.bind(this));
		this._mapObserver = new NetworkObserver(PacketKind.Map, this.OnMapReceived.bind(this));
		toastr.options.closeDuration = 10000;

		const p = new Player(props.playerName);
		p.IsReady = false;
		const dictionnary = new Dictionnary<Player>();
		dictionnary.Add(p.Name, p);

		this.setState({
			RoomName: props.RoomName,
			Players: dictionnary,
			IsAdmin: props.isAdmin.toLowerCase() == 'true' ? true : false,
			Player: p,
			Message: '',
			IaNumber: 0,
			Settings: new GameSettings()
		});

		this._socket = new NetworkSocket(props.playerName, props.RoomName, this.state.IsAdmin);

		this._onPeerConnectionChanged = this.PeerConnectionChanged.bind(this);
		this._socket.OnPeerConnectionChanged.On(this._onPeerConnectionChanged);
		this._socket.OnReceived.On(this._toastObserver);
		this._socket.OnReceived.On(this._readyObserver);
		this._socket.OnReceived.On(this._contextObserver);
		this._socket.OnReceived.On(this._playersObserver);
		this._socket.OnReceived.On(this._pingObserver);

		// NetworkService.Dispatcher.Init(!this.state.IsAdmin);
	}

	componentDidMount() {
		this._isFirstRender = false;
	}

	componentWillUnmount() {
		this._socket.OnReceived.Off(this._toastObserver);
		this._socket.OnReceived.Off(this._readyObserver);
		this._socket.OnReceived.Off(this._contextObserver);
		this._socket.OnReceived.Off(this._playersObserver);
		this._socket.OnPeerConnectionChanged.Off(this._onPeerConnectionChanged);
	}

	render() {
		return (
			<div>
				<div class="absolute-center-top generalContainer">
					<div class="logo-container">
						<div class="fill-logo-back-container">
							<div class="fill-logo-back spin-fade" />
						</div>
						<div class="fill-logo" />
					</div>
					{this.GetUpdsideButton()}
					<PlayersComponent NetworkHandler={this._socket} HostState={this.state} />
					{this.GetDownsideButton()}
				</div>
				{this.GetSettings()}
				<div class="absolute-center-bottom custom-black-btn">{this.GetMessageForm()}</div>
			</div>
		);
	}
	GetSettings() {
		if (this._hasSettings) {
			return (
				<div class="optionContainer absolute-center-middle">
					<div class="title-container">Settings</div>
					<OptionComponent Data={this.state.Settings} Update={this.Update.bind(this)} />
				</div>
			);
		} else {
			return '';
		}
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
	private Update(gameSetting: GameSettings): void {
		this._hasSettings = false;
		this.setState({
			Settings: gameSetting
		});
	}

	private GetMessageForm() {
		return (
			<div class="input-group mb-3">
				<input
					type="text"
					class="form-control"
					id="toastMessageBox"
					value={this.state.Message}
					onInput={linkState(this, 'Message')}
					aria-label="Example text with button addon"
					aria-describedby="button-addon1"
				/>
				<div class="input-group-append">
					<button class="btn btn-dark" type="button" id="button-addon1" onClick={() => this.SendToast()}>
						{IconProvider.GetIcon(this._isFirstRender, 'fas fa-comment')}
					</button>
				</div>
			</div>
		);
	}

	private GetDownsideButton() {
		return (
			<div class="container-center-horizontal">
				{ComponentsHelper.GetBlackButton(this._isFirstRender, 'fas fa-toggle-on', this.GetButtonLabel(), () =>
					this.ChangeReady()
				)}
				{ComponentsHelper.GetBlackButton(this._isFirstRender, 'fas fa-cog', 'Setup', () => {
					this._hasSettings = true;
					this.setState({});
				})}
			</div>
		);
	}

	private GetUpdsideButton() {
		return (
			<div class="container-center-horizontal">
				{ComponentsHelper.GetBlackButton(this._isFirstRender, 'fas fa-undo-alt', 'Back', () => this.Back())}
				{ComponentsHelper.GetRedButton(this._isFirstRender, 'far fa-play-circle', 'Start', () => this.Start())}
			</div>
		);
	}

	private GetButtonLabel() {
		if (this.state.Player.IsReady) {
			return 'Ok';
		}
		return 'Nok';
	}

	private OnMapReceived(data: NetworkMessage<MapContext>): void {
		route('/Canvas', true);
	}

	private OnPlayerReadyChanged(data: NetworkMessage<boolean>): void {
		if (this.state.Players.Exist(data.Emitter)) {
			this.state.Players.Get(data.Emitter).IsReady = data.Content;
			this.setState({});
		}
	}

	private OnToastReceived(message: NetworkMessage<string>): void {
		if (message) {
			toastr['success'](message.Content, `> ${message.Emitter}`, { iconClass: 'toast-gray' });
			document.getElementById('toastMessageBox').focus();
		}
	}

	private OnPlayersChanged(message: NetworkMessage<string[]>): void {
		message.Content.forEach((playerName) => {
			if (!this.state.Players.Exist(playerName)) {
				this.state.Players.Add(playerName, new Player(playerName));
			}
		});

		this.state.Players.Keys().filter((p) => message.Content.indexOf(p) === -1).forEach((c) => {
			this.state.Players.Remove(c);
		});

		this.setState({});
	}

	private OnPingChanged(message: NetworkMessage<string>): void {
		if (this.state.Players.Exist(message.Emitter)) {
			this.state.Players.Get(message.Emitter).Latency = message.Content;
			this.setState({});
		}
	}

	private ChangeReady(): void {
		const player = this.state.Player;
		player.IsReady = !player.IsReady;
		this.setState({});
		const message = new NetworkMessage<boolean>();
		message.Emitter = this.state.Player.Name;
		message.Content = player.IsReady;
		message.Kind = PacketKind.Ready;
		message.Recipient = PeerSocket.All();
		this._socket.Emit(message);
	}

	private SendToast(): void {
		let message = new NetworkMessage<string>();
		message.Emitter = this.state.Player.Name;
		message.Recipient = PeerSocket.All();
		message.Content = this.state.Message;
		message.Kind = PacketKind.Toast;
		this.setState({
			Message: ''
		});

		toastr['success'](message.Content, `> ${message.Emitter}`, { iconClass: 'toast-white' });
		this._socket.Emit(message);
		document.getElementById('toastMessageBox').focus();
	}

	private Start(): void {
		if (this.IsEveryoneReady()) {
			const mapContext = new MapGenerator().GetMapDefinition(
				12,
				'Flower',
				this.state.Players.Count(),
				MapMode.forest
			);
			mapContext.PlayerName = this.state.Player.Name;
			this.Assign(mapContext, this.state.Players.Values());

			const message = new NetworkMessage<MapContext>();
			message.Content = mapContext;
			message.Kind = PacketKind.Map;
			message.Recipient = PeerSocket.All();
			message.Emitter = this.state.Player.Name;
			this._socket.Emit(message);
			this.SetIa(mapContext);
			this.HideRoom();
		}
	}

	public SetIa(mapContext: MapContext): void {
		let index = 0;
		mapContext.Hqs.forEach((hq) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA${index}`;
			}
			index += 1;
		});
	}

	private HideRoom(): void {
		const message = new NetworkMessage<any>();
		message.Emitter = this.state.Player.Name;
		message.Recipient = PeerSocket.Server();
		message.Kind = PacketKind.Hide;
		this._socket.Emit(message);
	}

	private OnStarted(data: NetworkMessage<MapContext>): void {
		GameHelper.MapContext = data.Content;
		route('/Canvas', true);
	}

	public Assign(mapContext: any, players: Player[]): void {
		if (mapContext.Hqs.length < players.length) {
			throw new Error('not enough hq');
		}
		for (let i = 0; i < mapContext.Hqs.length; i++) {
			if (i < players.length) {
				mapContext.Hqs[i].PlayerName = players[i].Name;
			}
		}
	}

	private IsEveryoneReady(): boolean {
		let players = this.state.Players.Values();
		for (let i = 0; i < players.length; i++) {
			if (!players[i].IsReady) {
				return false;
			}
		}
		return true;
	}

	private Back(): void {
		this._socket.Stop();
		route('/Home', true);
	}
}
