import { PeerContext } from './../PeerContext';
import { PacketKind } from '../../../Message/PacketKind';
import { RtcPeer } from './RtcPeer';

export class RtcOfferer extends RtcPeer {
	constructor(context: PeerContext) {
		super(context);

		//setup channel
		this.Channel = this.Connection.createDataChannel(this.Context.Recipient);
		this.Channel.onopen = () => this.OpenDataChannel();
		this.Channel.onmessage = (event: MessageEvent) => this.ReceivePacket(event);

		this.Connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
			if (event.candidate) {
				const message = this.Context.GetTemplate<any>(PacketKind.Candidate);
				message.Content = event.candidate;
				this.Context.ServerSocket.Emit(message);
			}
		};

		//create a negotiation offer
		this.Connection.onnegotiationneeded = async () => {
			try {
				const offer = await this.Connection.createOffer();
				await this.Connection.setLocalDescription(offer);
				// send the offer to the other peer
				const message = this.Context.GetTemplate<any>(PacketKind.Offer);
				message.Content = this.Connection.localDescription;
				if (message.Recipient === message.Emitter) {
					throw 'whats going on';
				}
				this.Context.ServerSocket.Emit(message);
			} catch (err) {
				console.error(err);
			}
		};
	}

	public GetType(): string {
		return 'O';
	}
}
