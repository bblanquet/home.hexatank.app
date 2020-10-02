import { KindEvent } from './../Core/Utils/Events/KindEvent';
import { ConnectionStatus } from './ConnectionStatus';
import { ReceiverSocket } from './Peer/ReceiverSocket';
import { OffererSocket } from './Peer/OffererSocket';
import { INetworkMessage } from './Message/INetworkMessage';
import { ServerSocket } from './Server/ServerSocket';
import { PeerSocket } from './Peer/PeerSocket';
import { NetworkMessage } from './Message/NetworkMessage';
import { PacketKind } from './Message/PacketKind';
import { Dictionnary } from '../Core/Utils/Collections/Dictionnary';
import { LiteEvent } from '../Core/Utils/Events/LiteEvent';
import { NetworkObserver } from './NetworkObserver';
import { KindEventObserver } from '../Core/Utils/Events/KindEventObserver';

export class NetworkSocket {
	protected PeerSockets: Dictionnary<PeerSocket> = new Dictionnary<PeerSocket>();
	protected ServerSocket: ServerSocket;
	protected Owner: string;

	private _isConnected: boolean;
	public OnConnectedChanged: LiteEvent<boolean> = new LiteEvent<boolean>();
	public OnPeerConnectionChanged: LiteEvent<PeerSocket> = new LiteEvent<PeerSocket>();
	public OnReceived: KindEvent<PacketKind, INetworkMessage> = new KindEvent<PacketKind, INetworkMessage>();

	private _playersObserver: NetworkObserver;
	private _offerObserver: NetworkObserver;
	private _resetObserver: NetworkObserver;
	private _pingObserver: NetworkObserver;

	constructor(owner: string, room: string, private _isAdmin: boolean) {
		this._playersObserver = new KindEventObserver(PacketKind.Players, this.OnPlayersReceived.bind(this));
		this._offerObserver = new KindEventObserver(PacketKind.Offer, this.OnOfferReceived.bind(this));
		this._resetObserver = new KindEventObserver(PacketKind.Reset, this.OnReset.bind(this));
		this._pingObserver = new KindEventObserver(PacketKind.Ping, this.OnPing.bind(this));

		this.Owner = owner;
		this.ServerSocket = new ServerSocket('https://mottet.xyz', 9117, this.Owner, room);
		this.ServerSocket.OnReceived.On(this._playersObserver);
		this.ServerSocket.OnReceived.On(this._offerObserver);
		this.ServerSocket.OnReceived.On(this._resetObserver);
		this.OnReceived.On(this._pingObserver);
		this.ServerSocket.Start();
	}

	private OnPlayersReceived(message: NetworkMessage<Array<string>>): void {
		if (!this._isAdmin) {
			if (this.PeerSockets.IsEmpty()) {
				message.Content.forEach((recipient) => {
					if (recipient !== this.Owner) {
						this.CreateOfferSocket(recipient);
					}
				});
			}
		}
		this.OnReceived.Invoke(PacketKind.Players, message);
	}

	private CreateOfferSocket(recipient: string) {
		const offererSocket = new OffererSocket(this.ServerSocket, this.Owner, recipient);
		this.PeerSockets.Add(recipient, offererSocket);
		//todo subscription
		offererSocket.OnShutdown.On(this.OnShutdown.bind(this));
		offererSocket.OnReceivedMessage.On(this.OnReceivedPeerMessage.bind(this));
		offererSocket.OnStateChanged.On(this.OnConnectionStatusChanged.bind(this));
	}

	private SetConnection(isConnected: boolean): void {
		if (this._isConnected !== isConnected) {
			this._isConnected = isConnected;
			this.OnConnectedChanged.Invoke(this, this._isConnected);
		}
	}

	private OnConnectionStatusChanged(peer: any, connection: ConnectionStatus): void {
		const isNotAllConnected = this.PeerSockets.Values().some((p) => p.GetConnectionStatus().IsNotConnected());
		if (isNotAllConnected) {
			this.SetConnection(false);
		}
		this.OnPeerConnectionChanged.Invoke(this, peer);
	}

	private OnReceivedPeerMessage(peer: any, message: NetworkMessage<any>): void {
		this.OnReceived.Invoke(message.Kind, message);
	}

	private OnOfferReceived(message: NetworkMessage<any>): void {
		if (!this.PeerSockets.Exist(message.Emitter)) {
			const receiverSocket = new ReceiverSocket(this.ServerSocket, this.Owner, message.Emitter);
			this.PeerSockets.Add(message.Emitter, receiverSocket);
			//todo subscription
			receiverSocket.OnShutdown.On(this.OnShutdown.bind(this));
			receiverSocket.OnReceivedMessage.On(this.OnReceivedPeerMessage.bind(this));
			receiverSocket.OnStateChanged.On(this.OnConnectionStatusChanged.bind(this));
			receiverSocket.ReceivedOffer(message);
		}
	}

	private OnShutdown(): void {
		this.PeerSockets.Values().forEach((peer) => {
			if (peer.IsShutDown) {
				console.log(`[PEER] [REMOVED] ${peer.GetRecipient()}`);
				this.PeerSockets.Remove(peer.GetRecipient());
			}
		});
	}

	private OnReset(message: NetworkMessage<any>): void {
		if (this.PeerSockets.Exist(message.Emitter)) {
			this.PeerSockets.Get(message.Emitter).ShutDown();
		}
		this.CreateOfferSocket(message.Emitter);
	}

	private OnPing(message: NetworkMessage<any>): void {
		if (!this._isConnected) {
			const now = new Date();
			const twoSecondsEarlierThanNow = now.setSeconds(now.getSeconds() - 2);
			const pingPackets = this.PeerSockets.Values().map((p) => p.GetLastPing());
			const isAllFreshPing = pingPackets.filter((ping) => ping.Date < twoSecondsEarlierThanNow).length === 0;
			const isAllGoodPing = pingPackets.filter((ping) => 1000 < ping.Latency).length === 0;
			if (isAllFreshPing && isAllGoodPing) {
				this.SetConnection(true);
			}
		}
	}

	public EmitServer<T>(kind: PacketKind, content: T): void {
		const message = new NetworkMessage<T>();
		message.Content = content;
		message.Kind = kind;
		message.Recipient = PeerSocket.Server();
		message.Emitter = this.Owner;
		this.Emit(message);
	}

	public EmitAll<T>(kind: PacketKind, content: T): void {
		const message = new NetworkMessage<T>();
		message.Content = content;
		message.Kind = kind;
		message.Recipient = PeerSocket.All();
		message.Emitter = this.Owner;
		this.Emit(message);
	}

	public Emit(message: INetworkMessage): void {
		if (message.Recipient === PeerSocket.All()) {
			this.PeerSockets.Values().forEach((peer) => {
				peer.Send(message);
			});
		} else if (message.Recipient === PeerSocket.Server()) {
			this.ServerSocket.Emit(message);
		} else {
			if (this.PeerSockets.Exist(message.Recipient)) {
				this.PeerSockets.Get(message.Recipient).Send(message);
			}
		}
	}

	public Stop(): void {
		this.OnConnectedChanged.Clear();
		this.OnPeerConnectionChanged.Clear();
		this.OnReceived.Clear();
		this.ServerSocket.Stop();
		this.PeerSockets.Values().forEach((peer) => {
			peer.ShutDown();
		});
		this.PeerSockets.Clear();
	}

	public Kick(name: string): void {
		const message = new NetworkMessage<string>();
		message.Kind = PacketKind.Kick;
		message.Recipient = name;
		message.Emitter = this.Owner;
		this.ServerSocket.Emit(message);
	}
}
