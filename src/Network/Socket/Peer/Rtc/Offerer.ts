import { PacketKind } from '../../../Message/PacketKind';
import { IServerSocket } from '../../Server/IServerSocket';
import { RtcPeer } from './RtcPeer';

export class Offerer extends RtcPeer {
	private _timeOut: any;

	constructor(serverSocket: IServerSocket, roomName: string, owner: string, recipient: string) {
		super(serverSocket, roomName, owner, recipient);
		this.Connection = this.GetRtcConnection();

		//setup channel
		this.Channel = this.Connection.createDataChannel(recipient);
		this.Channel.onopen = () => this.OpenDataChannel();
		this.Channel.onmessage = (event: MessageEvent) => this.ReceivePacket(event);

		this.Connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
			if (event.candidate) {
				const message = this.GetTemplate<any>(PacketKind.Candidate);
				message.Content = event.candidate;
				this.ServerSocket.Emit(message);
			}
		};

		//create a negotiation offer
		this.Connection.onnegotiationneeded = async () => {
			try {
				const offer = await this.Connection.createOffer();
				await this.Connection.setLocalDescription(offer);
				// send the offer to the other peer
				const message = this.GetTemplate<any>(PacketKind.Offer);
				message.Content = this.Connection.localDescription;
				this.ServerSocket.Emit(message);
			} catch (err) {
				console.error(err);
			}
		};

		//setup connection check
		this._timeOut = setTimeout(() => this.TimeOut(), 6000);
		this.Connection.oniceconnectionstatechange = (e: Event) => {
			clearTimeout(this._timeOut);
			if (!this.IsConnected()) {
				this._timeOut = setTimeout(() => this.TimeOut(), 6000);
			}
			this.OnIceStateChanged.Invoke();
		};

		this.ServerPing.OnPingReceived.On((obj: any, data: number) => {
			if (!this.IsConnected()) {
				let message = this.GetTemplate(PacketKind.Reset);
				this.ServerSocket.Emit(message);
				this.ShutDown();
			}
		});
	}

	public GetType(): string {
		return 'O';
	}

	protected TimeOut(): void {
		if (!this.IsConnected() && !this.IsShutdown()) {
			this.ServerPing.Start();
		}
	}
}
