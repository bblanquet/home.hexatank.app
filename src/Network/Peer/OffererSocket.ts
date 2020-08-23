import { PeerSocket } from './PeerSocket';
import { ServerSocket } from '../Server/ServerSocket';
import { PacketKind } from '../Message/PacketKind';
import { ConnectionKind } from '../ConnectionKind';

export class OffererSocket extends PeerSocket {
	private _timeOut: NodeJS.Timeout;

	constructor(serverSocket: ServerSocket, owner: string, recipient: string) {
		super(serverSocket, owner, recipient);
		this.Connection = this.GetRtcConnection();

		//setup channel
		this.Channel = this.Connection.createDataChannel(recipient);
		this.Channel.onopen = () => this.OpenDataChannel();
		this.Channel.onmessage = (event: MessageEvent) => this.ReceivePacket(event);

		this.Connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
			if (event.candidate) {
				console.log(`[${this.Recipient} -> ${this.Owner}] CANDIDATE <<<`);
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
			const connection = this.GetConnectionStatus();

			console.log(`ICE CHANGED: ${this.Recipient} ${connection.State} ${ConnectionKind[connection.Kind]}`);
			if (connection.IsNotConnected()) {
				this._timeOut = setTimeout(() => this.TimeOut(), 6000);
			}
			this.OnStateChanged.Invoke(this, connection);
		};

		this.ServerPing.PingReceived.On((obj: any, data: number) => {
			if(this.GetConnectionStatus().IsNotConnected()){
				let message = this.GetTemplate(PacketKind.Reset);
				this.ServerSocket.Emit(message);
				this.ShutDown();
			}
		});

		console.log(`[PEER] [OFFER] ${recipient}`);
	}

	protected GetType(): string {
		return 'O';
	}

	protected TimeOut(): void {
		const connection = this.GetConnectionStatus();
		if (connection.IsNotConnected() && !this.IsShutDown) {
			console.log(`TIMEOUT: ${this.Recipient} ${connection.State} ${ConnectionKind[connection.Kind]}`);
			this.ServerPing.Start();
		}
	}
}
