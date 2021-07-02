import { Hook } from './Hook';
import { RoomState } from '../Model/RoomState';
import { route } from 'preact-router';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { NetworkObserver } from '../../Utils/Events/NetworkObserver';
import { LogKind } from '../../Utils/Logger/LogKind';
import { NetworkMessage } from '../../Network/Message/NetworkMessage';
import { PacketKind } from '../../Network/Message/PacketKind';
import { IServerSocket } from '../../Network/Socket/Server/IServerSocket';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { ISocketService } from '../../Services/Socket/ISocketService';
import { Singletons, SingletonKey } from '../../Singletons';
import { NotificationItem } from '../Components/Notification/NotificationItem';
import { StateUpdater } from 'preact/hooks';
import { GuestState } from '../Model/GuestState';
import { Usernames } from '../Model/Names';

export class GuestHook extends Hook<GuestState> {
	private _socket: IServerSocket;
	private _obs: NetworkObserver[];
	public OnNotification: LiteEvent<NotificationItem> = new LiteEvent<NotificationItem>();

	constructor(data: GuestState, protected SetState: StateUpdater<GuestState>) {
		super(data, SetState);
		this._obs = [
			new NetworkObserver(PacketKind.Available, this.OnAvailable.bind(this)),
			new NetworkObserver(PacketKind.Rooms, this.OnRoom.bind(this)),
			new NetworkObserver(PacketKind.connect, this.OnConnect.bind(this)),
			new NetworkObserver(PacketKind.Password, this.OnPassword.bind(this)),
			new NetworkObserver(PacketKind.connect_error, this.OnConnectError.bind(this))
		];
		this._socket = Singletons.Load<ISocketService>(SingletonKey.Socket).Publish();
		this._socket.On(this._obs);
	}

	public Unmount(): void {
		this._socket.Off(this._obs);
	}

	public static DefaultState(): GuestState {
		const profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		return {
			Rooms: new Array<RoomState>(),
			DisplayableRooms: new Array<RoomState>(),
			PlayerName: profilService.GetProfil().LastPlayerName,
			filter: '',
			Password: ''
		};
	}

	public Join(roomName: string): void {
		this._socket.Emit(
			NetworkMessage.New<any>(PacketKind.Password, { Password: this.State.Password, RoomName: roomName })
		);
	}

	public SetUsername(value: string): void {
		this.SetProp((e) => (e.PlayerName = value.substring(0, 15)));
	}

	public SetFilter(value: string): void {
		this.SetProp((e) => (e.filter = value));
	}

	public SetPassword(value: string): void {
		this.SetProp((e) => (e.Password = value));
	}

	public Randomize(): void {
		this.SetProp((e) => {
			e.PlayerName = Usernames[Math.round(Math.random() * Usernames.length - 1)];
		});
	}

	public Back() {
		route('{{sub_path}}Home', true);
	}

	public Refresh() {
		this._socket.Emit(NetworkMessage.New(PacketKind.Rooms, {}));
	}

	public OnAvailable(message: NetworkMessage<{ IsAvailable: boolean; RoomName: string }>): void {
		if (message.Content.IsAvailable) {
			Singletons.Load<IOnlineService>(SingletonKey.Online).Register(
				this.State.PlayerName,
				message.Content.RoomName,
				this.State.Password,
				this.State.Password !== null && this.State.Password !== '',
				false
			);
			route('{{sub_path}}Lobby', true);
		} else {
			this.OnNotification.Invoke(
				this,
				new NotificationItem(
					LogKind.warning,
					`${this.State.PlayerName} is already used in ${message.Content.RoomName}`
				)
			);
		}
	}

	private OnRoom(message: NetworkMessage<RoomState[]>): void {
		this.SetProp((e) => {
			e.Rooms = message.Content;
			if (this.State.filter && 0 < this.State.filter.length) {
				const newDisplayed = this.State.Rooms.filter((e) =>
					e.Name.toLowerCase().includes(this.State.filter.toLowerCase())
				);
				if (newDisplayed.length !== this.State.DisplayableRooms.length) {
					this.State.DisplayableRooms = newDisplayed;
				}
			} else if (this.State.DisplayableRooms !== this.State.Rooms && this.State.filter.length === 0) {
				this.State.DisplayableRooms = this.State.Rooms;
			}
		});
	}

	private OnConnect(m: NetworkMessage<any>): void {
		this._socket.Emit(NetworkMessage.New<any>(PacketKind.Rooms, {}));
	}

	private OnPassword(m: NetworkMessage<{ Password: boolean; RoomName: string }>): void {
		if (m.Content.Password) {
			this._socket.Emit(
				NetworkMessage.New<any>(PacketKind.Available, {
					RoomName: m.Content.RoomName,
					PlayerName: this.State.PlayerName
				})
			);
		} else {
			this.OnNotification.Invoke(
				this,
				new NotificationItem(
					LogKind.warning,
					`${this.State.Password} doesn't match ${m.Content.RoomName}'s password`
				)
			);
		}
	}

	private OnConnectError(m: any): void {
		this.OnNotification.Invoke(
			this,
			new NotificationItem(LogKind.error, `OOPS Server doesn't seem to be running.`)
		);
	}
}
