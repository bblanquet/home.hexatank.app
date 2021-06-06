import { NetworkObserver } from '../../../NetworkObserver';
import { SimpleEvent } from '../../../../Core/Utils/Events/SimpleEvent';
import { TimeoutPingObserver } from '../Ping/TimeoutPingObserver';
import { LiteEvent } from '../../../../Core/Utils/Events/LiteEvent';
import { INetworkMessage } from '../../../Message/INetworkMessage';
import { NetworkMessage } from '../../../Message/NetworkMessage';
import { PacketKind } from '../../../Message/PacketKind';
import { isNullOrUndefined } from '../../../../Core/Utils/ToolBox';
import { IServerSocket } from '../../Server/IServerSocket';

export abstract class RtcPeer {
	protected Connection: RTCPeerConnection;
	protected Channel: RTCDataChannel;
	private _candidate: RTCIceCandidate;
	protected ServerPing: TimeoutPingObserver;

	protected ServerSocket: IServerSocket;
	protected Owner: string;
	protected RoomName: string;
	protected Recipient: string;

	private _isShutDown: boolean = false;

	public OnShutDown: SimpleEvent = new SimpleEvent();
	public OnChannelOpened: SimpleEvent = new SimpleEvent();
	public OnIceStateChanged: SimpleEvent = new SimpleEvent();
	public OnReceived: LiteEvent<NetworkMessage<any>> = new LiteEvent<NetworkMessage<any>>();

	private _obs: NetworkObserver[];

	constructor(serverSocket: IServerSocket, roomName: string, owner: string, recipient: string) {
		//basic info
		this.Recipient = recipient;
		this.Owner = owner;
		this.RoomName = roomName;

		//setup server
		this.ServerSocket = serverSocket;
		this._obs = [
			new NetworkObserver(PacketKind.Candidate, this.HandleCandidate.bind(this)),
			new NetworkObserver(PacketKind.Offer, this.HandleOffer.bind(this))
		];
		this.ServerSocket.On(this._obs);

		//setup ping
		this.ServerPing = new TimeoutPingObserver(this, this.ServerSocket, this.RoomName, this.Owner, recipient, 2000);
	}

	protected ReceivePacket(event: MessageEvent): void {
		this.OnReceived.Invoke(this, JSON.parse(event.data));
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

	public async HandleCandidate(message: NetworkMessage<any>): Promise<void> {
		if (message.Emitter === this.Recipient) {
			let candidate = new RTCIceCandidate(message.Content);
			await this.Connection.addIceCandidate(candidate);
		}
	}

	public async HandleOffer(packet: NetworkMessage<any>): Promise<void> {
		if (packet.Emitter === this.Recipient) {
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
		this.ServerSocket.Off(this._obs);
		this.OnReceived.Clear();
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
		message.RoomName = this.RoomName;
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
