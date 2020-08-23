import { PacketKind } from './../Message/PacketKind';
import { PeerSocket } from './PeerSocket';
import { ServerSocket } from '../Server/ServerSocket';

export class ReceiverSocket extends PeerSocket{
    constructor(serverSocket: ServerSocket,owner:string,recipient: string){
        super(serverSocket,owner,recipient);
		this.Connection = this.GetRtcConnection();

		this.Connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
			if (event.candidate) {
                const message = this.GetTemplate(PacketKind.Candidate);
                message.Content = event.candidate;
				this.ServerSocket.Emit(message);
			}
		};

        this.Connection.ondatachannel = (event: RTCDataChannelEvent) => {
			console.log(`[${this.Recipient} -> ${this.Owner}] CHANNEL <<<`);
			this.Channel = event.channel;
			this.Channel.onopen = ()=>this.OpenDataChannel();
			this.Channel.onmessage = (event: MessageEvent) => this.ReceivePacket(event);
		};
		
		this.Connection.oniceconnectionstatechange = (e: Event) => {
			const connection = this.GetConnectionStatus();
			this.OnStateChanged.Invoke(this, connection);
		};

		console.log(`[PEER] [RECEIVER] ${recipient}`);
	}
	
	protected GetType(): string {
		return 'R';
	}

    protected TimeOut(): void {
    }
}