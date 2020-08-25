import { PeerPingObserver } from './Ping/PeerPingObserver';
import { TimeoutPingObserver } from './Ping/TimeoutPingObserver';
import { ConnectionStatus } from './../ConnectionStatus';
import { PacketKind } from '../Message/PacketKind';
import { NetworkMessage } from '../Message/NetworkMessage';
import { ServerSocket } from '../Server/ServerSocket';
import { ConnectionKind } from '../ConnectionKind';
import { isNullOrUndefined } from 'util';
import { INetworkMessage } from '../Message/INetworkMessage';
import { PingPacket } from './Ping/PingPacket';
import { LiteEvent } from '../../Core/Utils/Events/LiteEvent';
import { SimpleEvent } from '../../Core/Utils/Events/SimpleEvent';
import { NetworkObserver } from '../NetworkObserver';

export abstract class PeerSocket {
	protected Connection: RTCPeerConnection;
	protected Channel: RTCDataChannel;
	protected ServerSocket: ServerSocket;
	protected ServerPing: TimeoutPingObserver;
	protected PeerPing: PeerPingObserver;

	protected Owner: string;
	protected Recipient: string;
	public IsShutDown: boolean = false;

	public OnReceivedMessage: LiteEvent<NetworkMessage<any>> = new LiteEvent<NetworkMessage<any>>();
	public OnShutdown: SimpleEvent = new SimpleEvent();
	public OnStateChanged: LiteEvent<ConnectionStatus> = new LiteEvent<ConnectionStatus>();

	private _candidateObserver: NetworkObserver;
	private _offerObserver: NetworkObserver;

	constructor(serverSocket: ServerSocket, owner: string, recipient: string) {
		//basic info
		this.Recipient = recipient;
		this.Owner = owner;

		//setup server
		this.ServerSocket = serverSocket;
		this._candidateObserver = new NetworkObserver(PacketKind.Candidate, this.ReceivedCandidate.bind(this));
		this._offerObserver = new NetworkObserver(PacketKind.Offer, this.ReceivedOffer.bind(this));
		this.ServerSocket.OnReceived.On(this._candidateObserver);
		this.ServerSocket.OnReceived.On(this._offerObserver);

		//setup ping
		this.ServerPing = new TimeoutPingObserver(this.ServerSocket, this.Owner, this.GetRecipient(), 2000);
	}

	protected ReceivePacket(event: MessageEvent): void {
		const packet = <INetworkMessage>JSON.parse(event.data);
		if (!this.IsPing(packet.Kind)) {
			console.log(`[${packet.Emitter}] > ${this.Owner}] ${PacketKind[packet.Kind]} <<<`);
		}
		if (packet.Recipient === PeerSocket.All() || packet.Recipient === this.Owner) {
			const value = (packet as any).Content;
			const message = new NetworkMessage<any>();
			message.Recipient = packet.Recipient;
			message.Emitter = packet.Emitter;
			message.Kind = packet.Kind;
			message.Content = isNullOrUndefined(value) ? null : value;
			this.OnReceivedMessage.Invoke(this, message);
		}
	}

	public static All(): string {
		return 'ALL';
	}

	public static Server(): string {
		return 'Server';
	}

	private IsPing(type: number) {
		return type === PacketKind.OneWayPing || type === PacketKind.TwoWayPing;
	}

	protected GetRtcConnection(): RTCPeerConnection {
		return new RTCPeerConnection({
			iceServers: [
				{
					urls: [ 'stun:stun.l.google.com:19302', 'stun:stun.2talk.co.nz:3478' ]
				}
			]
		});
	}

	private _candidate: RTCIceCandidate;

	public async ReceivedCandidate(message: NetworkMessage<any>): Promise<void> {
		if (message.Emitter === this.Recipient) {
			console.log(`[${this.Recipient} -> ${this.Owner}] CANDIDATE <<<`);
			let candidate = new RTCIceCandidate(message.Content);
			await this.Connection.addIceCandidate(candidate);
		}
	}

	public async ReceivedOffer(packet: NetworkMessage<any>): Promise<void> {
		if (packet.Emitter === this.Recipient) {
			try {
				await this.Connection.setRemoteDescription(new RTCSessionDescription(packet.Content));
				if (this._candidate) {
					await this.Connection.addIceCandidate(this._candidate);
					this._candidate = null;
				}

				this.LogMessage(packet);
				if (this.Connection.remoteDescription.type === 'offer') {
					var rtcDescriptionInit = await this.Connection.createAnswer();
					await this.Connection.setLocalDescription(rtcDescriptionInit);

					const message = this.GetTemplate<any>(PacketKind.Offer);
					message.Content = this.Connection.localDescription;
					this.ServerSocket.Emit(message);
				}
			} catch (error) {
				console.log(error);
			}
		}
	}

	public GetLastPing(): PingPacket {
		if (this.PeerPing) {
			return this.PeerPing.GetLastPing();
		} else {
			return new PingPacket();
		}
	}

	private LogMessage(message: INetworkMessage) {
		const data = `[${message.Emitter} -> ${this
			.Owner}] ${this.Connection.remoteDescription.type.toUpperCase()} <<<`;
		console.log(data);
	}

	private Fail(message: INetworkMessage) {
		const data = `[${message.Emitter} -> ${this.Owner}] ${PacketKind[message.Kind]} ### FAILED`;
		console.log(data);
	}

	protected OpenDataChannel(): void {
		if (this.Channel.readyState === 'open') {
			this.OnStateChanged.Invoke(this, this.GetConnectionStatus());
		}
	}

	public GetRecipient(): string {
		return this.Recipient;
	}

	private IsChannelReady(): boolean {
		return this.Channel && this.Channel.readyState === 'open';
	}

	private _lastConnectionStatus: ConnectionStatus;
	public GetConnectionStatus(): ConnectionStatus {
		const connection = new ConnectionStatus();
		let state = isNullOrUndefined(this.Connection) ? 'NA' : this.Connection.iceConnectionState;
		connection.SetConnection(state);
		connection.Type = this.GetType();
		if (connection.Kind === ConnectionKind.Ok) {
			if (this.IsChannelReady()) {
				if (!this.HasPing()) {
					this.CreatePing();
				}
			} else {
				connection.SetConnection('checking');
			}
		}
		this._lastConnectionStatus = connection;
		return connection;
	}

	private HasPing() {
		return !isNullOrUndefined(this.PeerPing);
	}

	private CreatePing() {
		this.PeerPing = new PeerPingObserver(this, this.Owner);
		this.PeerPing.PingReceived.On((obj: any, latency: string) => {
			const message = new NetworkMessage<string>();
			message.Kind = PacketKind.Ping;
			message.Emitter = this.GetRecipient();
			message.Recipient = this.Owner;
			message.Content = latency;

			if (this._lastConnectionStatus && this._lastConnectionStatus.IsNotConnected()) {
				//code for firefox
				const connection = this.GetConnectionStatus();
				if (!connection.IsNotConnected()) {
					this.OnStateChanged.Invoke(this, connection);
				}
			}

			this.OnReceivedMessage.Invoke(this, message);
		});
		this.PeerPing.Start();
	}

	protected abstract GetType(): string;

	public Send(message: INetworkMessage): void {
		if (this.Channel) {
			this.Channel.send(JSON.stringify(message));
		} else {
			this.Fail(message);
		}
	}

	public ShutDown(): void {
		this.IsShutDown = true;
		this.OnShutdown.Invoke();
		this.ServerPing.Stop();
		if (this.PeerPing) {
			this.PeerPing.Stop();
		}
		this.ServerSocket.OnReceived.Off(this._candidateObserver);
		this.ServerSocket.OnReceived.Off(this._offerObserver);
		this.OnShutdown.Clear();
		this.OnStateChanged.Invoke(this, this.GetConnectionStatus());
		this.OnReceivedMessage.Clear();
		this.OnStateChanged.Clear();
		if (this.Connection) {
			this.Connection.close();
			this.Connection = null;
		}
		if (this.Channel) {
			this.Channel.close();
			this.Channel = null;
		}
	}

	protected GetTemplate<T>(kind: PacketKind): NetworkMessage<T> {
		const message = new NetworkMessage<T>();
		message.Kind = kind;
		message.Emitter = this.Owner;
		message.Recipient = this.Recipient;
		return message;
	}
}
