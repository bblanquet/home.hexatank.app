import { IServerSocket } from './../IServerSocket';
import { EmptyMessage } from '../Message/EmptyMessage';
import { INetworkMessage } from '../Message/INetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { NetworkMessage } from '../Message/NetworkMessage';
import { KindEvent } from '../../Core/Utils/Events/KindEvent';
import { ISocketService } from '../../Services/Socket/ISocketService';
import { Singletons, SingletonKey } from '../../Singletons';
import { NetworkObserver } from '../NetworkObserver';

export class RoomSocket {
	private _socket: IServerSocket;
	private _name: string;
	private _room: string;
	private _password: string = '';
	private _hasPassword: boolean = false;
	private _roomKey: string;

	public OnReceived: KindEvent<PacketKind, INetworkMessage>;

	constructor(sender: string, room: string, password: string, hasPassword: boolean) {
		this._socket = Singletons.Load<ISocketService>(SingletonKey.Socket).Publish();
		this._name = sender;
		this._room = room;
		this._hasPassword = hasPassword;
		this._password = password;
		this._roomKey = '';
		this.OnReceived = new KindEvent<PacketKind, INetworkMessage>();
		const observers = [
			new NetworkObserver(PacketKind.Players, this.OnPlayers.bind(this)),
			new NetworkObserver(PacketKind.Joined, this.OnJoined.bind(this)),
			new NetworkObserver(PacketKind.Close, this.OnClose.bind(this)),
			new NetworkObserver(PacketKind.Kick, this.OnKick.bind(this)),
			new NetworkObserver(PacketKind.Offer, this.OnRtc.bind(this)),
			new NetworkObserver(PacketKind.Candidate, this.OnRtc.bind(this)),
			new NetworkObserver(PacketKind.OneWayPing, this.OnRtc.bind(this)),
			new NetworkObserver(PacketKind.TwoWayPing, this.OnRtc.bind(this)),
			new NetworkObserver(PacketKind.Reset, this.OnRtc.bind(this))
		];

		if (this.HasRoomKey()) {
			observers.push(new NetworkObserver(PacketKind.Join, this.OnJoin.bind(this)));
		}

		this._socket.Off([]);
		this._socket.On(observers);
	}

	private HasRoomKey(): boolean {
		return this._roomKey !== '';
	}

	public Start() {
		this._socket.Emit(
			NetworkMessage.Create<any>(PacketKind.Join, {
				PlayerName: this._name,
				RoomName: this._room,
				Password: this._password,
				HasPassword: this._hasPassword,
				Key: this._roomKey
			})
		);
	}

	public Stop() {
		this.OnReceived.Clear();
		this._socket.Emit(
			NetworkMessage.Create<any>(PacketKind.Leave, {
				PlayerName: this._name,
				RoomName: this._room
			})
		);
		this._socket.Close();
	}

	public Kick(room: string, name: string) {
		this._socket.Emit(
			NetworkMessage.Create<any>(PacketKind.Kick, {
				PlayerName: name,
				RoomName: room
			})
		);
	}

	public Emit(packet: INetworkMessage): void {
		packet.RoomName = this._room;
		this._socket.Emit(packet);
	}

	private OnPlayers(data: NetworkMessage<string[]>): void {
		this.OnReceived.Invoke(data.Kind, data);
	}

	private OnJoined(data: NetworkMessage<string>): void {
		this._roomKey = data.Content;
	}

	private OnJoin(data: NetworkMessage<any>): void {
		this._socket.Emit(
			NetworkMessage.Create<any>(PacketKind.Join, {
				PlayerName: this._name,
				RoomName: this._room,
				Password: this._password,
				HasPassword: this._hasPassword,
				Key: this._roomKey
			})
		);
	}

	private OnClose(data: NetworkMessage<any>): void {
		const message = new EmptyMessage();
		message.Kind = PacketKind.Close;
		this.OnReceived.Invoke(message.Kind, message);
	}

	private OnKick(data: NetworkMessage<any>): void {
		if (this._name === data.Content.PlayerName) {
			const message = new EmptyMessage();
			message.Kind = PacketKind.Kick;
			this.OnReceived.Invoke(message.Kind, message);
		}
	}

	private OnRtc(data: NetworkMessage<any>): void {
		if (data.Recipient === this._name) {
			this.OnReceived.Invoke(data.Kind, data);
		}
	}
}
