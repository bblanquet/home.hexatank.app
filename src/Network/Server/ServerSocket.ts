import { EmptyMessage } from '../Message/EmptyMessage';
import { INetworkMessage } from '../Message/INetworkMessage';
import { PacketKind } from '../Message/PacketKind';
import { NetworkMessage } from '../Message/NetworkMessage';
import { KindEvent } from '../../Core/Utils/Events/KindEvent';
import * as io from 'socket.io-client';

export class ServerSocket {
	private Socket: any;
	private _address: string;
	private _name: string;
	private _room: string;
	private _password: string;
	private _hasPassword: boolean;
	private _roomKey: string;

	public OnReceived: KindEvent<PacketKind, INetworkMessage>;

	constructor(url: string, subfolder: string, sender: string, room: string, password: string, hasPassword: boolean) {
		this._address = `${url}`;
		this.Socket = io(this._address, { path: subfolder });
		this._name = sender;
		this._room = room;
		this._hasPassword = hasPassword;
		this._password = password;
		this._roomKey = '';
		this.OnReceived = new KindEvent<PacketKind, INetworkMessage>();
		this.Listen();
	}

	private HasRoomKey(): boolean {
		return this._roomKey !== '';
	}

	public Start() {
		this.Socket.emit(PacketKind[PacketKind.Join], {
			PlayerName: this._name,
			RoomName: this._room,
			Password: this._password,
			HasPassword: this._hasPassword
		});
	}

	public Stop() {
		this.OnReceived.Clear();
		this.Socket.emit(PacketKind[PacketKind.Leave], {
			PlayerName: this._name,
			RoomName: this._room
		});
		this.Socket.close();
	}

	public Kick(room: string, name: string) {
		this.Socket.emit(PacketKind[PacketKind.Kick], {
			PlayerName: name,
			RoomName: room
		});
	}

	public Emit(packet: INetworkMessage): void {
		packet.RoomName = this._room;
		this.Socket.emit(PacketKind[packet.Kind], packet);
	}

	private Listen(): void {
		this.Socket.on('connect', () => {
			this.Socket.on(PacketKind[PacketKind.Players], (data: { Content: string[] }) => {
				const message = new NetworkMessage<Array<string>>();
				message.Content = data.Content;
				message.Kind = PacketKind.Players;
				this.OnReceived.Invoke(message.Kind, message);
			});

			this.Socket.on(PacketKind[PacketKind.Joined], (data: any) => {
				this._roomKey = data.Content;
			});

			this.Socket.on(PacketKind[PacketKind.Close], (data: any) => {
				const message = new EmptyMessage();
				message.Kind = PacketKind.Close;
				this.OnReceived.Invoke(message.Kind, message);
			});

			this.Socket.on(PacketKind[PacketKind.Kick], (data: any) => {
				if (this._name === data.PlayerName) {
					const message = new EmptyMessage();
					message.Kind = PacketKind.Kick;
					this.OnReceived.Invoke(message.Kind, message);
				}
			});

			this.Socket.on(PacketKind[PacketKind.Offer], (data: NetworkMessage<any>) => {
				if (data.Recipient === this._name) {
					this.OnReceived.Invoke(data.Kind, data);
				}
			});

			this.Socket.on(PacketKind[PacketKind.Candidate], (data: NetworkMessage<any>) => {
				if (data.Recipient === this._name) {
					this.OnReceived.Invoke(data.Kind, data);
				}
			});

			this.Socket.on(PacketKind[PacketKind.OneWayPing], (data: NetworkMessage<any>) => {
				if (data.Recipient === this._name) {
					this.OnReceived.Invoke(data.Kind, data);
				}
			});

			this.Socket.on(PacketKind[PacketKind.TwoWayPing], (data: NetworkMessage<any>) => {
				if (data.Recipient === this._name) {
					this.OnReceived.Invoke(data.Kind, data);
				}
			});

			this.Socket.on(PacketKind[PacketKind.Reset], (data: NetworkMessage<any>) => {
				if (data.Recipient === this._name) {
					this.OnReceived.Invoke(data.Kind, data);
				}
			});

			if (this.HasRoomKey()) {
				this.Socket.emit(PacketKind[PacketKind.Join], {
					PlayerName: this._name,
					RoomName: this._room,
					Key: this._roomKey
				});
			}
		});
	}
}
