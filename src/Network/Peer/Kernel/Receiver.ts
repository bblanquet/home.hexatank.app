import { PacketKind } from '../../Message/PacketKind';
import { PeerKernel } from './PeerKernel';
import { ServerSocket } from '../../Server/ServerSocket';

export class Receiver extends PeerKernel {
	constructor(serverSocket: ServerSocket, owner: string, recipient: string) {
		super(serverSocket, owner, recipient);
		this.Connection = this.GetRtcConnection();

		this.Connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
			if (event.candidate) {
				const message = this.GetTemplate(PacketKind.Candidate);
				message.Content = event.candidate;
				this.ServerSocket.Emit(message);
			}
		};

		this.Connection.ondatachannel = (event: RTCDataChannelEvent) => {
			console.log(`[${this.Recipient} -> server -> ${this.Owner}] CHANNEL <<<`);
			this.Channel = event.channel;
			this.Channel.onopen = () => this.OpenDataChannel();
			this.Channel.onmessage = (event: MessageEvent) => this.ReceivePacket(event);
		};

		this.Connection.oniceconnectionstatechange = (e: Event) => {
			this.OnIceStateChanged.Invoke();
		};

		console.log(`[PEER] [RECEIVER] ${recipient}`);
	}

	public GetType(): string {
		return 'R';
	}

	protected TimeOut(): void {}
}