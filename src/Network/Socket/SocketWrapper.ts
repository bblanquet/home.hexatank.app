import { TimeoutPeerHandler } from './Peer/TimeoutHandler';
import { ISocketWrapper } from './INetworkSocket';
import { IServerSocket } from './Server/IServerSocket';
import { RtcOfferer } from './Peer/Rtc/RtcOfferer';
import { KindEvent } from '../../Core/Utils/Events/KindEvent';
import { ConnectionStatus } from '../ConnectionStatus';
import { RtcReceiver } from './Peer/Rtc/RtcReceiver';
import { INetworkMessage } from '../Message/INetworkMessage';
import { PeerSocket } from './Peer/PeerSocket';
import { NetworkMessage } from '../Message/NetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { Dictionary } from '../../Core/Utils/Collections/Dictionary';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { KindEventObserver } from '../../Core/Utils/Events/KindEventObserver';
import { ProtocolKind } from '../Message/ProtocolKind';
import { PeerContext } from './Peer/PeerContext';

export class SocketWrapper implements ISocketWrapper {
	protected PeerSockets: Dictionary<PeerSocket> = new Dictionary<PeerSocket>();
	protected ServerSocket: IServerSocket;
	protected Owner: string;
	protected RoomName: string;

	private _isConnected: boolean;
	public OnConnectedChanged: LiteEvent<boolean> = new LiteEvent<boolean>();
	public OnPeerConnectionChanged: LiteEvent<PeerSocket> = new LiteEvent<PeerSocket>();
	public OnReceived: KindEvent<PacketKind, INetworkMessage> = new KindEvent<PacketKind, INetworkMessage>();

	constructor(serverSocket: IServerSocket, roomName: string, owner: string, private _isShy: boolean) {
		this.Owner = owner;
		this.RoomName = roomName;
		this.ServerSocket = serverSocket;
		this.ServerSocket.On([
			new KindEventObserver(PacketKind.Players, this.HandlePlayersChanged.bind(this)),
			new KindEventObserver(PacketKind.Offer, this.HandleOffer.bind(this)),
			new KindEventObserver(PacketKind.Reset, this.HandleReset.bind(this))
		]);
		this.OnReceived.On(new KindEventObserver(PacketKind.Ping, this.HandlePing.bind(this)));
	}

	private HandlePlayersChanged(message: NetworkMessage<Array<string>>): void {
		//remove potentially kicked players
		this.PeerSockets.Keys().filter((name) => !message.Content.includes(name)).forEach((name) => {
			this.PeerSockets.Get(name).ShutDown();
		});

		if (!this._isShy) {
			this._isShy = true;
			if (this.PeerSockets.IsEmpty()) {
				message.Content.forEach((recipient) => {
					if (recipient !== this.Owner) {
						this.CreateOfferSocket(recipient);
					}
				});
			}
		}
	}

	private CreateOfferSocket(recipient: string) {
		const context = new PeerContext(this.ServerSocket, this.RoomName, this.Owner, recipient);
		const offerer = new RtcOfferer(context);
		const offererSocket = new PeerSocket(offerer);
		new TimeoutPeerHandler(offerer, context);
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

	private OnConnectionStatusChanged(src: PeerSocket, connection: ConnectionStatus): void {
		const isNotAllConnected = this.PeerSockets.Values().some((p) => p.GetConnectionStatus().IsNotConnected());
		if (isNotAllConnected) {
			this.SetConnection(false);
		}
		this.OnPeerConnectionChanged.Invoke(this, src);
	}

	private OnReceivedPeerMessage(peer: any, message: NetworkMessage<any>): void {
		this.OnReceived.Invoke(message.Kind, message);
	}

	private HandleOffer(message: NetworkMessage<any>): void {
		if (!this.PeerSockets.Exist(message.Emitter) && message.Recipient === this.Owner) {
			const receiver = new RtcReceiver(
				new PeerContext(this.ServerSocket, this.RoomName, this.Owner, message.Emitter)
			);
			const receiverSocket = new PeerSocket(receiver);
			this.PeerSockets.Add(message.Emitter, receiverSocket);
			//todo subscription
			receiverSocket.OnShutdown.On(this.OnShutdown.bind(this));
			receiverSocket.OnReceivedMessage.On(this.OnReceivedPeerMessage.bind(this));
			receiverSocket.OnStateChanged.On(this.OnConnectionStatusChanged.bind(this));
			receiver.HandleOffer(message);
		}
	}

	private OnShutdown(): void {
		this.PeerSockets.Values().forEach((peer) => {
			if (peer.IsShutDown()) {
				this.PeerSockets.Remove(peer.GetRecipient());
			}
		});
	}

	private HandleReset(message: NetworkMessage<any>): void {
		if (this.PeerSockets.Exist(message.Emitter) && message.Recipient === this.Owner) {
			this.PeerSockets.Get(message.Emitter).ShutDown();
		}
		this.CreateOfferSocket(message.Emitter);
	}

	private HandlePing(message: NetworkMessage<any>): void {
		if (!this._isConnected && this.IsAllPeerConnected()) {
			this.SetConnection(true);
		}
	}

	private IsAllPeerConnected() {
		const now = new Date();
		const twoSecondsEarlierThanNow = now.setSeconds(now.getSeconds() - 2);
		const pingPackets = this.PeerSockets.Values().map((p) => p.GetLastPing());
		const isAllFreshPing = pingPackets.filter((ping) => ping.PingDate < twoSecondsEarlierThanNow).length === 0;
		const isAllGoodPing = pingPackets.filter((ping) => 1000 < ping.Latency).length === 0;
		return isAllFreshPing && isAllGoodPing;
	}

	public EmitAll<T>(kind: PacketKind, content: T): void {
		const message = new NetworkMessage<T>();
		message.Content = content;
		message.Kind = kind;
		message.Recipient = PeerSocket.All();
		message.Emitter = this.Owner;
		message.Protocol = ProtocolKind.Tcp;
		message.IsAck = false;
		this.Emit(message);
	}

	public Emit(message: INetworkMessage): void {
		message.EmittedDate = new Date().getTime();
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
		this.ServerSocket.Close();
		this.PeerSockets.Values().forEach((peer) => {
			peer.ShutDown();
		});
		this.PeerSockets.Clear();
	}
}
