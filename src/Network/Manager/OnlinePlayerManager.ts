import { IServerSocket } from './../Socket/Server/IServerSocket';
import { ISocketWrapper } from './../Socket/INetworkSocket';
import { Dictionnary } from '../../Core/Utils/Collections/Dictionnary';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { OnlinePlayer } from '../OnlinePlayer';
import { IOnlinePlayerManager } from './IOnlinePlayerManager';
import { NetworkObserver } from '../../Core/Utils/Events/NetworkObserver';
import { PacketKind } from '../Message/PacketKind';
import { NetworkMessage } from '../Message/NetworkMessage';
import { PeerSocket } from '../Socket/Peer/PeerSocket';

export class OnlinePlayerManager implements IOnlinePlayerManager {
	public OnPlayersChanged: LiteEvent<Dictionnary<OnlinePlayer>>;
	private _servObs: NetworkObserver[];
	private _peerObs: NetworkObserver[];

	constructor(
		private _serverSocket: IServerSocket,
		private _socketWrapper: ISocketWrapper,
		public Player: OnlinePlayer,
		public Players: Dictionnary<OnlinePlayer>
	) {
		this.OnPlayersChanged = new LiteEvent<Dictionnary<OnlinePlayer>>();

		this._servObs = [
			//room
			new NetworkObserver(PacketKind.Players, this.HandlePlayers.bind(this))
		];

		this._serverSocket.On(this._servObs);
		this._peerObs = [
			//peer
			new NetworkObserver(PacketKind.Ping, this.HandlePing.bind(this)),
			new NetworkObserver(PacketKind.TimeOut, this.HandleTimeout.bind(this))
		];
		this._socketWrapper.OnPeerConnectionChanged.On(this.PeerConnectionChanged.bind(this));

		this._peerObs.forEach((obs) => {
			this._socketWrapper.OnReceived.On(obs);
		});
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

	Clear(): void {
		this._serverSocket.Off(this._servObs);
		this._peerObs.forEach((obs) => {
			this._socketWrapper.OnReceived.Off(obs);
		});
		this._socketWrapper.OnPeerConnectionChanged.Clear();
	}
}