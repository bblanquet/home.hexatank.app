import { PeerContext } from './../PeerContext';
import { PacketKind } from '../../../Message/PacketKind';
import { RtcPeer } from './RtcPeer';

export class RtcReceiver extends RtcPeer {
	constructor(context: PeerContext) {
		super(context);

		this.Connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
			if (event.candidate && !this.IsConnected()) {
				const message = this.Context.GetTemplate<any>(PacketKind.Candidate);
				message.Content = event.candidate;
				context.ServerSocket.Emit(message);
			}
		};

		this.Connection.ondatachannel = (event: RTCDataChannelEvent) => {
			this.Channel = event.channel;
			this.Channel.onopen = () => this.OpenDataChannel();
			this.Channel.onmessage = (event: MessageEvent) => this.ReceivePacket(event);
		};
	}

	public GetType(): string {
		return 'R';
	}
}
