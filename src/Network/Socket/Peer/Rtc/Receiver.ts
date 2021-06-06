import { PacketKind } from '../../../Message/PacketKind';
import { IServerSocket } from '../../Server/IServerSocket';
import { RtcPeer } from './RtcPeer';

export class Receiver extends RtcPeer {
	constructor(serverSocket: IServerSocket, roomName: string, owner: string, recipient: string) {
		super(serverSocket, roomName, owner, recipient);
		this.Connection = this.GetRtcConnection();

		this.Connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
			if (event.candidate && !this.IsConnected()) {
				const message = this.GetTemplate(PacketKind.Candidate);
				message.Content = event.candidate;
				this.ServerSocket.Emit(message);
			}
		};

		this.Connection.ondatachannel = (event: RTCDataChannelEvent) => {
			this.Channel = event.channel;
			this.Channel.onopen = () => this.OpenDataChannel();
			this.Channel.onmessage = (event: MessageEvent) => this.ReceivePacket(event);
		};

		this.Connection.oniceconnectionstatechange = (e: Event) => {
			this.OnIceStateChanged.Invoke();
		};
	}

	public GetType(): string {
		return 'R';
	}

	protected TimeOut(): void {}
}
