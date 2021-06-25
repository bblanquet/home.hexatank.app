import { IPeerSocket } from './IPeerSocket';
import { TcpSender } from './TcpSender';
import { LatencyProvider } from './LatencyProvider';
import { LiteEvent } from '../../../Core/Utils/Events/LiteEvent';
import { SimpleEvent } from '../../../Core/Utils/Events/SimpleEvent';
import { ConnectionStatus } from '../../ConnectionStatus';
import { INetworkMessage } from '../../Message/INetworkMessage';
import { PeerPingObserver } from './Ping/PeerPingObserver';
import { NetworkMessage } from '../../Message/NetworkMessage';
import { PacketKind } from '../../Message/PacketKind';
import { PingData } from './Ping/PingData';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';
import { ConnectionKind } from '../../ConnectionKind';
import { ProtocolKind } from '../../Message/ProtocolKind';
import { RtcPeer } from './Rtc/RtcPeer';
import { StaticLogger } from '../../../Core/Utils/Logger/StaticLogger';
import { LogKind } from '../../../Core/Utils/Logger/LogKind';

export class PeerSocket implements IPeerSocket {
	private _seqNum: number = 0;
	private _tcpSenders: TcpSender[];
	private _status: ConnectionStatus;

	public OnShutdown: SimpleEvent = new SimpleEvent();
	public OnStateChanged: LiteEvent<ConnectionStatus> = new LiteEvent<ConnectionStatus>();
	public OnReceivedMessage: LiteEvent<NetworkMessage<any>> = new LiteEvent<NetworkMessage<any>>();

	private _peerPing: PeerPingObserver;
	private _latencyProvider: LatencyProvider;

	constructor(private _rtcPeer: RtcPeer) {
		this._tcpSenders = new Array<TcpSender>();
		this._latencyProvider = new LatencyProvider();

		this._rtcPeer.OnChannelOpened.On(() => {
			this.OnStateChanged.Invoke(this, this.GetConnectionStatus());
		});
		this._rtcPeer.OnIceStateChanged.On(() => {
			this.OnStateChanged.Invoke(this, this.GetConnectionStatus());
		});
		this._rtcPeer.OnReceived.On((e: any, data: NetworkMessage<any>) => {
			this.ReceivePacket(data);
		});

		this._rtcPeer.OnShutDown.On(() => this.ShutDown());
	}

	public Send(message: INetworkMessage): void {
		if (!message.IsAck) {
			this._seqNum += 1;
			message.SeqNum = this._seqNum;
		}

		if (this.IsTcp(message)) {
			this.SentTcp(message);
		} else {
			this._rtcPeer.Send(message);
		}
	}

	private SentTcp(message: INetworkMessage) {
		//override
		this._tcpSenders.filter((t) => t.GetKind() === message.Kind).forEach((e) => e.Stop());
		const tcpSender = new TcpSender(this._rtcPeer, message);
		//clean when done
		tcpSender.OnDone.On(() => {
			this._tcpSenders = this._tcpSenders.filter((t) => !t.IsDone());
		});
		//add
		this._tcpSenders.push(tcpSender);
	}

	private IsTcp(message: INetworkMessage) {
		return message.Protocol === ProtocolKind.Tcp && !message.IsAck;
	}

	protected ReceivePacket(packet: NetworkMessage<any>): void {
		if (!this.IsPing(packet.Kind)) {
			StaticLogger.Log(
				LogKind.info,
				`[${packet.Emitter}] > ${this._rtcPeer.GetOwner()}] ${PacketKind[packet.Kind]} <<<`
			);
		}
		if (packet.Protocol === ProtocolKind.Tcp && packet.IsAck) {
			StaticLogger.Log(
				LogKind.info,
				`[${packet.Emitter}] > ${this._rtcPeer.GetOwner()}] ${PacketKind[
					packet.Kind
				]} [ACK] [${packet.SeqNum}]<<<`
			);
			return;
		}

		if (packet.Recipient === PeerSocket.All() || packet.Recipient === this._rtcPeer.GetOwner()) {
			const message = this.Convert(packet);
			message.Latency = this._latencyProvider.GetLatency(packet);
			this.OnReceivedMessage.Invoke(this, message);
		}

		if (packet.Protocol === ProtocolKind.Tcp && !packet.IsAck) {
			const message = this.Convert(packet);
			message.Recipient = message.Emitter;
			message.Emitter = this._rtcPeer.GetOwner();
			message.IsAck = true;
			this.Send(message);
		}
	}

	private Convert(packet: NetworkMessage<any>) {
		const message = new NetworkMessage<any>();
		message.Recipient = packet.Recipient;
		message.Emitter = packet.Emitter;
		message.Kind = packet.Kind;
		message.Content = (packet as any).Content;
		message.SeqNum = packet.SeqNum;
		message.IsAck = packet.IsAck;
		message.Protocol = packet.Protocol;
		return message;
	}

	public static All(): string {
		return 'ALL';
	}

	public static Server(): string {
		return 'Server';
	}

	private IsPing(type: number) {
		return type === PacketKind.OneWayPing || type === PacketKind.TwoWayPing;
	}

	public GetLastPing(): PingData {
		if (this._peerPing) {
			return this._peerPing.GetLastPingData();
		} else {
			return new PingData();
		}
	}

	private CreatePing() {
		this._peerPing = new PeerPingObserver(this._rtcPeer, this._rtcPeer.GetOwner(), this._rtcPeer.GetRecipient());
		this._peerPing.OnTimeoutStateChanged.On((obj: any, state: boolean) => {
			this.OnReceivedMessage.Invoke(this, this.GetMessage<boolean>(PacketKind.TimeOut, state));
		});
		this._peerPing.OnPingReceived.On((obj: any, data: PingData) => {
			if (this._status && this._status.IsNotConnected()) {
				//code for firefox
				const connection = this.GetConnectionStatus();
				if (!connection.IsNotConnected()) {
					this.OnStateChanged.Invoke(this, connection);
				}
			}
			this._latencyProvider.CalculateLatency(data);
			this.OnReceivedMessage.Invoke(this, this.GetMessage<string>(PacketKind.Ping, data.Latency.toString()));
		});
		this._peerPing.Start();
	}

	public GetConnectionStatus(): ConnectionStatus {
		const connection = new ConnectionStatus();
		connection.SetConnection(this._rtcPeer.GetIceState());
		connection.Type = this._rtcPeer.GetType();
		if (connection.Kind === ConnectionKind.Ok) {
			if (this._rtcPeer.IsChannelReady()) {
				if (!this.HasPing()) {
					this.CreatePing();
				}
			} else {
				connection.SetConnection('checking');
			}
		}
		this._status = connection;
		return this._status;
	}

	private GetMessage<T>(kind: PacketKind, data: T) {
		const deltaMessage = new NetworkMessage<T>();
		deltaMessage.Kind = kind;
		deltaMessage.Emitter = this.GetRecipient();
		deltaMessage.Recipient = this._rtcPeer.GetRecipient();
		deltaMessage.Content = data;
		return deltaMessage;
	}

	public GetRecipient(): string {
		return this._rtcPeer.GetRecipient();
	}

	private HasPing() {
		return !isNullOrUndefined(this._peerPing);
	}

	public ShutDown(): void {
		if (!this._rtcPeer.IsShutdown()) {
			this._rtcPeer.ShutDown();
		}
		this.OnStateChanged.Invoke(this, this.GetConnectionStatus());
		this.OnShutdown.Invoke();
		this.OnShutdown.Clear();
		this.OnReceivedMessage.Clear();
		this.OnStateChanged.Clear();
	}

	public IsShutDown(): boolean {
		return this._rtcPeer.IsShutdown();
	}
}
