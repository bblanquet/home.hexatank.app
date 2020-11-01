import { SimpleEvent } from './../../../Core/Utils/Events/SimpleEvent';
import { TimeoutPingObserver } from '../Ping/TimeoutPingObserver';
import { LiteEvent } from '../../../Core/Utils/Events/LiteEvent';
import { INetworkMessage } from '../../Message/INetworkMessage';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { PacketKind } from '../../Message/PacketKind';
import { NetworkObserver } from '../../NetworkObserver';
import { ServerSocket } from '../../Server/ServerSocket';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';

export abstract class PeerKernel {
	protected Connection: RTCPeerConnection;
	protected Channel: RTCDataChannel;
	private _candidate: RTCIceCandidate;
	private _candidateObserver: NetworkObserver;
	private _offerObserver: NetworkObserver;
	protected ServerPing: TimeoutPingObserver;

	protected ServerSocket: ServerSocket;
	protected Owner: string;
	protected Recipient: string;

	private _isShutDown: boolean = false;

	public OnShutDown: SimpleEvent = new SimpleEvent();
	public OnChannelOpened: SimpleEvent = new SimpleEvent();
	public OnIceStateChanged: SimpleEvent = new SimpleEvent();
	public OnReceivedMessage: LiteEvent<NetworkMessage<any>> = new LiteEvent<NetworkMessage<any>>();

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
		this.ServerPing = new TimeoutPingObserver(this, this.ServerSocket, this.Owner, recipient, 2000);
	}

	protected ReceivePacket(event: MessageEvent): void {
		this.OnReceivedMessage.Invoke(this, JSON.parse(event.data));
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

	public async ReceivedCandidate(message: NetworkMessage<any>): Promise<void> {
		if (message.Emitter === this.Recipient) {
			console.log(
				`[${message.Emitter} -> Server -> ${message.Recipient}] ${PacketKind[PacketKind.Candidate]} <<<`
			);
			let candidate = new RTCIceCandidate(message.Content);
			await this.Connection.addIceCandidate(candidate);
		}
	}

	public async ReceivedOffer(packet: NetworkMessage<any>): Promise<void> {
		if (packet.Emitter === this.Recipient) {
			console.log(`[${packet.Emitter} -> Server -> ${packet.Recipient}] ${PacketKind[PacketKind.Offer]} <<<`);
			try {
				await this.Connection.setRemoteDescription(new RTCSessionDescription(packet.Content));
				if (this._candidate) {
					await this.Connection.addIceCandidate(this._candidate);
					this._candidate = null;
				}

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

	protected OpenDataChannel(): void {
		if (this.Channel.readyState === 'open') {
			this.OnChannelOpened.Invoke();
		}
	}

	public IsChannelReady(): boolean {
		return this.Channel && this.Channel.readyState === 'open';
	}

	public abstract GetType(): string;

	public Send(message: INetworkMessage): void {
		if (this.Channel) {
			this.Channel.send(JSON.stringify(message));
		}
	}

	public ShutDown(): void {
		this._isShutDown = true;
		this.OnShutDown.Invoke();
		this.OnShutDown.Clear();
		this.ServerSocket.OnReceived.Off(this._candidateObserver);
		this.ServerSocket.OnReceived.Off(this._offerObserver);
		this.OnReceivedMessage.Clear();
		if (this.Connection) {
			this.Connection.close();
			this.Connection = null;
		}
		if (this.Channel) {
			this.Channel.close();
			this.Channel = null;
		}
	}

	public GetIceState(): string {
		return isNullOrUndefined(this.Connection) ? 'NA' : this.Connection.iceConnectionState;
	}

	public IsConnected() {
		return this.GetIceState() === 'connected' || this.GetIceState() === 'completed';
	}

	protected GetTemplate<T>(kind: PacketKind): NetworkMessage<T> {
		const message = new NetworkMessage<T>();
		message.Kind = kind;
		message.Emitter = this.Owner;
		message.Recipient = this.Recipient;
		return message;
	}

	public IsShutdown(): boolean {
		return this._isShutDown;
	}

	public GetRecipient(): string {
		return this.Recipient;
	}

	public GetOwner(): string {
		return this.Owner;
	}
}
