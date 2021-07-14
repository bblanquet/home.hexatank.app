import { IOnlinePlayerManager } from './IOnlinePlayerManager';
import { ISocketWrapper } from './../Socket/INetworkSocket';
import { Message } from '../../Components/Model/Message';
import { ILobbyManager } from './ILobbyManager';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Lobby } from './Lobby';
import { PacketKind } from '../Message/PacketKind';
import { NetworkMessage } from '../Message/NetworkMessage';
import { NetworkObserver } from '../../Utils/Events/NetworkObserver';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { IServerSocket } from '../Socket/Server/IServerSocket';
import { PeerSocket } from '../Socket/Peer/PeerSocket';
import { BlueprintSetup } from '../../Components/Components/Form/BlueprintSetup';

export class LobbyManager implements ILobbyManager {
	public OnKicked: SimpleEvent = new SimpleEvent();
	public OnMessageReceived: LiteEvent<Message> = new LiteEvent<Message>();
	public OnStarting: SimpleEvent = new SimpleEvent();

	private _servObs: NetworkObserver[];
	private _peerObs: NetworkObserver[];

	constructor(
		private _serverSocket: IServerSocket,
		private _socketWrapper: ISocketWrapper,
		private _onlinePlayerManager: IOnlinePlayerManager,
		private _lobby: Lobby,
		private _blueprintSetup: BlueprintSetup
	) {
		this._servObs = [
			//room
			new NetworkObserver(PacketKind.Joined, this.HandleJoined.bind(this)),
			new NetworkObserver(PacketKind.Close, this.HandleClose.bind(this)),
			new NetworkObserver(PacketKind.reconnect, this.Reconnect.bind(this)),
			new NetworkObserver(PacketKind.connect, this.Reconnect.bind(this))
		];
		this._serverSocket.On(this._servObs);

		this._peerObs = [
			//peer
			new NetworkObserver(PacketKind.Ready, this.HandleReady.bind(this)),
			new NetworkObserver(PacketKind.Toast, this.HandleMessage.bind(this)),
			new NetworkObserver(PacketKind.Loading, this.HandleLoading.bind(this))
		];

		this._peerObs.forEach((obs) => {
			this._socketWrapper.OnReceived.On(obs);
		});

		this.Join();
	}
	GetSetup(): BlueprintSetup {
		return this._blueprintSetup;
	}

	public SetReady(): void {
		this._onlinePlayerManager.Player.IsReady = !this._onlinePlayerManager.Player.IsReady;
		this._onlinePlayerManager.OnPlayersChanged.Invoke(this, this._onlinePlayerManager.Players);
		this.SendReadyState();
	}

	public SendReadyState() {
		this._socketWrapper.EmitAll<boolean>(PacketKind.Ready, this._onlinePlayerManager.Player.IsReady);
	}

	public Join() {
		this._serverSocket.Emit(
			NetworkMessage.New<any>(PacketKind.Join, {
				PlayerName: this._onlinePlayerManager.Player.Name,
				RoomName: this._lobby.Name,
				Password: this._lobby.Password,
				HasPassword: this._lobby.HasPassword,
				Key: this._lobby.Key
			})
		);
	}

	public Kick(playerName: string) {
		this._serverSocket.Emit(
			NetworkMessage.New<any>(PacketKind.Kick, {
				PlayerName: playerName,
				RoomName: this._lobby.Name
			})
		);
	}

	public SendMessage(content: string): void {
		let packet = new NetworkMessage<string>();
		packet.Emitter = this._onlinePlayerManager.Player.Name;
		packet.Recipient = PeerSocket.All();
		packet.Content = content;
		packet.Kind = PacketKind.Toast;
		packet.RoomName = this._lobby.Name;
		this._socketWrapper.Emit(packet);
		this.HandleMessage(packet);
	}

	private HandleMessage(message: NetworkMessage<string>): void {
		this.OnMessageReceived.Invoke(this, Message.New(message.Emitter, message.Content));
	}

	private HandleLoading(message: NetworkMessage<string>): void {
		if (this._onlinePlayerManager.Player.IsAdmin) {
			this._serverSocket.Emit(NetworkMessage.New(PacketKind.Hide, {}));
		}
		this.OnStarting.Invoke();
	}

	private HandleJoined(data: NetworkMessage<string>): void {
		this._lobby.Key = data.Content;
	}

	private HandleJoin(data: NetworkMessage<any>): void {
		this._serverSocket.Emit(
			NetworkMessage.New<any>(PacketKind.Join, {
				PlayerName: this._onlinePlayerManager.Player.Name,
				RoomName: this._lobby,
				Password: this._lobby.Password,
				HasPassword: this._lobby.HasPassword,
				Key: this._lobby.Key
			})
		);
	}

	private HandleClose(data: NetworkMessage<any>): void {
		this.OnKicked.Invoke();
	}

	private Reconnect(data: NetworkMessage<any>): void {
		if (this._lobby.Key) {
			this.Join();
		}
	}

	private HandleReady(data: NetworkMessage<boolean>): void {
		if (this._onlinePlayerManager.Players.Exist(data.Emitter)) {
			this._onlinePlayerManager.Players.Get(data.Emitter).IsReady = data.Content;
			this._onlinePlayerManager.OnPlayersChanged.Invoke(this, this._onlinePlayerManager.Players);
		}
	}

	Stop(): void {
		if (this._onlinePlayerManager.Player.IsAdmin) {
			this._serverSocket.Emit(NetworkMessage.New(PacketKind.Hide, {}));
		}
		this._serverSocket.Emit(
			NetworkMessage.New<any>(PacketKind.Leave, {
				PlayerName: this._onlinePlayerManager.Player.Name,
				RoomName: this._lobby.Name
			})
		);
		this.Clear();
	}

	Start(): void {
		if (this._onlinePlayerManager.Player.IsAdmin) {
			this._serverSocket.Emit(NetworkMessage.New(PacketKind.Hide, {}));
			this._socketWrapper.EmitAll(PacketKind.Loading, {});
			this.OnStarting.Invoke();
		}
	}

	Clear(): void {
		if (this._peerObs) {
			this._peerObs.forEach((obs) => {
				this._socketWrapper.OnReceived.Off(obs);
			});
		}

		if (this._servObs) {
			this._serverSocket.Off(this._servObs);
		}

		this.OnKicked.Clear();
		this.OnMessageReceived.Clear();
		this.OnStarting.Clear();
	}
}
