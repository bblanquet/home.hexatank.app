import { INetworkMessage } from './../Message/INetworkMessage';
import { Message } from './../../Components/Network/Message';
import { OnlinePlayer } from '../OnlinePlayer';
import { ILobbyManager } from './ILobbyManager';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { Lobby } from './Lobby';
import { PacketKind } from '../Message/PacketKind';
import { NetworkMessage } from '../Message/NetworkMessage';
import { NetworkObserver } from '../NetworkObserver';
import { SimpleEvent } from '../../Core/Utils/Events/SimpleEvent';
import { IServerSocket } from '../Socket/Server/IServerSocket';
import { SocketWrapper } from '../Socket/SocketWrapper';
import { PeerSocket } from '../Socket/Peer/PeerSocket';

export class LobbyManager implements ILobbyManager {
	private _socketWrapper: SocketWrapper;
	private _serverSocket: IServerSocket;
	private _lobby: Lobby;
	public Player: OnlinePlayer;
	public Players: Dictionnary<OnlinePlayer>;

	public OnKicked: SimpleEvent = new SimpleEvent();
	public OnPlayersChanged: LiteEvent<Dictionnary<OnlinePlayer>> = new LiteEvent<Dictionnary<OnlinePlayer>>();
	public OnMessageReceived: LiteEvent<Message> = new LiteEvent<Message>();

	private _servObs: NetworkObserver[];
	private _peerObs: NetworkObserver[];

	constructor(socket: IServerSocket, lobby: Lobby, players: Dictionnary<OnlinePlayer>, player: OnlinePlayer) {
		this._serverSocket = socket;
		this.Player = player;
		this.Players = players;
		this._lobby = lobby;
		this._servObs = [
			//room
			new NetworkObserver(PacketKind.Players, this.HandlePlayers.bind(this)),
			new NetworkObserver(PacketKind.Joined, this.HandleJoined.bind(this)),
			new NetworkObserver(PacketKind.Close, this.HandleClose.bind(this)),
			new NetworkObserver(PacketKind.Kick, this.HandleKick.bind(this))
		];
		if (this.HasRoomKey()) {
			this._servObs.push(new NetworkObserver(PacketKind.Join, this.HandleJoin.bind(this)));
		}
		this._serverSocket.On(this._servObs);

		this._peerObs = [
			//peer
			new NetworkObserver(PacketKind.Ready, this.HandleReady.bind(this)),
			new NetworkObserver(PacketKind.Ping, this.HandlePing.bind(this)),
			new NetworkObserver(PacketKind.TimeOut, this.HandleTimeout.bind(this)),
			new NetworkObserver(PacketKind.Toast, this.HandleMessage.bind(this))
		];

		this._socketWrapper = new SocketWrapper(
			this._serverSocket,
			this._lobby.Name,
			this.Player.Name,
			this.Player.IsAdmin
		);
		this._socketWrapper.OnPeerConnectionChanged.On(this.PeerConnectionChanged.bind(this));
		this._peerObs.forEach((obs) => {
			this._socketWrapper.OnReceived.On(obs);
		});

		this.Start();
	}

	SetReady(): void {
		this.Player.IsReady = !this.Player.IsReady;
		this.OnPlayersChanged.Invoke(this, this.Players);
		this._socketWrapper.EmitAll<boolean>(PacketKind.Ready, this.Player.IsReady);
	}

	private HasRoomKey(): boolean {
		return this._lobby.Key !== '';
	}

	public Start() {
		this._serverSocket.Emit(
			NetworkMessage.Create<any>(PacketKind.Join, {
				PlayerName: this.Player.Name,
				RoomName: this._lobby.Name,
				Password: this._lobby.Password,
				HasPassword: this._lobby.HasPassword,
				Key: this._lobby.Key
			})
		);
	}

	public Kick(playerName: string) {
		this._serverSocket.Emit(
			NetworkMessage.Create<any>(PacketKind.Kick, {
				PlayerName: playerName,
				RoomName: this._lobby.Name
			})
		);
	}

	public SendMessage(content: string): void {
		let packet = new NetworkMessage<string>();
		packet.Emitter = this.Player.Name;
		packet.Recipient = PeerSocket.All();
		packet.Content = content;
		packet.Kind = PacketKind.Toast;
		packet.RoomName = this._lobby.Name;
		this._socketWrapper.Emit(packet);
		this.HandleMessage(packet);
	}

	private HandleMessage(message: NetworkMessage<string>): void {
		this.OnMessageReceived.Invoke(this, Message.Create(message.Emitter, message.Content));
	}

	private HandleJoined(data: NetworkMessage<string>): void {
		this._lobby.Key = data.Content;
	}

	private HandleJoin(data: NetworkMessage<any>): void {
		this._serverSocket.Emit(
			NetworkMessage.Create<any>(PacketKind.Join, {
				PlayerName: this.Player.Name,
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

	private HandleKick(data: NetworkMessage<any>): void {
		if (this.Player.Name === data.Content.PlayerName) {
			this.OnKicked.Invoke();
		}
	}

	private HandleReady(data: NetworkMessage<boolean>): void {
		if (this.Players.Exist(data.Emitter)) {
			this.Players.Get(data.Emitter).IsReady = data.Content;
			this.OnPlayersChanged.Invoke(this, this.Players);
		}
	}

	private HandlePing(message: NetworkMessage<string>): void {
		if (this.Players.Exist(message.Emitter)) {
			this.Players.Get(message.Emitter).SetLatency(message.Content);
			this.OnPlayersChanged.Invoke(this, this.Players);
		}
	}

	private HandleTimeout(message: NetworkMessage<boolean>): void {
		if (this.Players.Exist(message.Emitter)) {
			this.Players.Get(message.Emitter).SetTimeOut(message.Content);
			this.OnPlayersChanged.Invoke(this, this.Players);
		}
	}

	//should be kept
	private HandlePlayers(message: NetworkMessage<string[]>): void {
		message.Content.forEach((playerName) => {
			if (!this.Players.Exist(playerName)) {
				this.Players.Add(playerName, new OnlinePlayer(playerName));
			}
		});

		this.Players.Keys().filter((p) => message.Content.indexOf(p) === -1).forEach((c) => {
			this.Players.Remove(c);
		});
		this.OnPlayersChanged.Invoke(this, this.Players);
	}

	private PeerConnectionChanged(obj: any, peer: PeerSocket): void {
		if (peer) {
			const player = this.Players.Get(peer.GetRecipient());
			if (player) {
				player.SetConnection(peer.GetConnectionStatus());
				this.OnPlayersChanged.Invoke(this, this.Players);
			}
		}
	}

	Close(): void {
		if (this.Player.IsAdmin) {
			this._serverSocket.Emit(NetworkMessage.Create(PacketKind.Hide, {}));
		}
		if (this._peerObs) {
			this._peerObs.forEach((obs) => {
				this._socketWrapper.OnReceived.Off(obs);
			});
		}
		this._serverSocket.Emit(
			NetworkMessage.Create<any>(PacketKind.Leave, {
				PlayerName: this.Player.Name,
				RoomName: this._lobby.Name
			})
		);
		if (this._socketWrapper) {
			this._socketWrapper.OnPeerConnectionChanged.Clear();
		}

		this.OnKicked.Clear();
		this.OnMessageReceived.Clear();
		this.OnPlayersChanged.Clear();
	}
	Leave(): void {
		this.Close();
		this._socketWrapper.Stop();
	}
}
