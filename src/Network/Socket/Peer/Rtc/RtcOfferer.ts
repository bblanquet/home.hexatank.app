import { PeerContext } from './../PeerContext';
import { PacketKind } from '../../../Message/PacketKind';
import { RtcPeer } from './RtcPeer';
import { ErrorHandler, ErrorCat } from '../../../../Core/Utils/Exceptions/ErrorHandler';

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
			const offer = await this.Connection.createOffer();
			await this.Connection.setLocalDescription(offer);
			// send the offer to the other peer
			const message = this.Context.GetTemplate<any>(PacketKind.Offer);
			message.Content = this.Connection.localDescription;
			if (message.Recipient === message.Emitter) {
				ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidParameter])));
			}
			this.Context.ServerSocket.Emit(message);
		};
	}

	public GetType(): string {
		return 'O';
	}
}
