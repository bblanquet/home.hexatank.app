import { PeerContext } from './../PeerContext';
import { NetworkObserver } from '../../../../Core/Utils/Events/NetworkObserver';
import { SimpleEvent } from '../../../../Core/Utils/Events/SimpleEvent';
import { LiteEvent } from '../../../../Core/Utils/Events/LiteEvent';
import { INetworkMessage } from '../../../Message/INetworkMessage';
import { NetworkMessage } from '../../../Message/NetworkMessage';
import { PacketKind } from '../../../Message/PacketKind';
import { isNullOrUndefined } from '../../../../Core/Utils/ToolBox';
import { LogKind } from '../../../../Core/Utils/Logger/LogKind';
import { StaticLogger } from '../../../../Core/Utils/Logger/StaticLogger';

//ice:
//it is the location of the peer (interaction connectivity establishment)
//setLocalDescription():
//prepares the offer, changes the local description associated with the connection

export abstract class RtcPeer {
	protected Connection: RTCPeerConnection;
	protected Channel: RTCDataChannel;
	private _candidate: RTCIceCandidate;

	protected Context: PeerContext;

	private _isShutDown: boolean = false;

	public OnShutDown: SimpleEvent = new SimpleEvent();
	public OnChannelOpened: SimpleEvent = new SimpleEvent();
	public OnIceStateChanged: SimpleEvent = new SimpleEvent();
	public OnReceived: LiteEvent<NetworkMessage<any>> = new LiteEvent<NetworkMessage<any>>();

	private _obs: NetworkObserver[];

	constructor(context: PeerContext) {
		this.Context = context;
		this._obs = [
			new NetworkObserver(PacketKind.Candidate, this.HandleCandidate.bind(this)),
			new NetworkObserver(PacketKind.Offer, this.HandleOffer.bind(this))
		];
		this.Context.ServerSocket.On(this._obs);

		this.Connection = this.GetRtcConnection();
		this.Connection.oniceconnectionstatechange = (e: Event) => {
			this.OnIceStateChanged.Invoke();
		};
	}

	protected ReceivePacket(event: MessageEvent): void {
		this.OnReceived.Invoke(this, JSON.parse(event.data));
	}

	protected GetRtcConnection(): RTCPeerConnection {
		//represents a connection between the local device and a remote peer
		return new RTCPeerConnection({
			iceServers: [
				{
					urls: [ 'stun:stun.l.google.com:19302', 'stun:stun.2talk.co.nz:3478' ]
				}
			]
		});
	}

	public async HandleCandidate(message: NetworkMessage<any>): Promise<void> {
		if (this.IsOk(message)) {
			let candidate = new RTCIceCandidate(message.Content);
			await this.Connection.addIceCandidate(candidate);
		}
	}

	private IsOk(message: NetworkMessage<any>) {
		return message.Emitter === this.Context.Recipient && message.Recipient === this.Context.Owner;
	}

	public async HandleOffer(packet: NetworkMessage<any>): Promise<void> {
		if (this.IsOk(packet)) {
			try {
				await this.Connection.setRemoteDescription(new RTCSessionDescription(packet.Content));
				if (this._candidate) {
					await this.Connection.addIceCandidate(this._candidate);
					this._candidate = null;
				}

				if (this.Connection.remoteDescription.type === 'offer') {
					var rtcDescriptionInit = await this.Connection.createAnswer();
					await this.Connection.setLocalDescription(rtcDescriptionInit);

					const message = this.Context.GetTemplate<any>(PacketKind.Offer);
					message.Content = this.Connection.localDescription;
					if (message.Recipient === message.Emitter) {
						throw 'whats going on';
					}
					this.Context.ServerSocket.Emit(message);
				}
			} catch (error) {
				StaticLogger.Log(LogKind.error, error);
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
			try {
				this.Channel.send(JSON.stringify(message));
			} catch (error) {
				StaticLogger.Log(LogKind.error, error);
			}
		}
	}

	public ShutDown(): void {
		this._isShutDown = true;
		this.OnShutDown.Invoke();
		this.OnShutDown.Clear();
		this.Context.ServerSocket.Off(this._obs);
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

	public IsShutdown(): boolean {
		return this._isShutDown;
	}

	public GetRecipient(): string {
		return this.Context.Recipient;
	}

	public GetOwner(): string {
		return this.Context.Owner;
	}
}
