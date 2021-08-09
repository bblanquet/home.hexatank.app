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
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { ISocketService } from '../../Services/Socket/ISocketService';
import { Singletons, SingletonKey } from '../../Singletons';
import { NotificationState } from '../Model/NotificationState';
import { StateUpdater } from 'preact/hooks';
import { GuestState } from '../Model/GuestState';
import { Usernames } from '../Model/Names';
import { ServerIssue } from '../Model/Dialogues';

export class GuestHook extends Hook<GuestState> {
	private _socket: IServerSocket;
	private _obs: NetworkObserver[];
	public OnNotification: LiteEvent<NotificationState> = new LiteEvent<NotificationState>();

	constructor(data: GuestState, protected SetState: StateUpdater<GuestState>) {
		super(data, SetState);
		this._obs = [
			new NetworkObserver(PacketKind.Available, this.OnAvailable.bind(this)),
			new NetworkObserver(PacketKind.Rooms, this.OnRoom.bind(this)),
			new NetworkObserver(PacketKind.Error, this.OnWrong.bind(this)),
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
		const profilService = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		return {
			Rooms: new Array<RoomState>(),
			PlayerName: profilService.GetProfile().LastPlayerName,
			filter: '',
			Password: ''
		};
	}

	private static FakeRooms(): RoomState[] {
		return Usernames.map((e) => new RoomState(e, 'US', 2, false, 2));
	}

	private OnWrong(message: NetworkMessage<string>): void {
		this.OnNotification.Invoke(this, new NotificationState(LogKind.warning, message.Content));
	}

	public Join(roomName: string): void {
		this._socket.Emit(
			NetworkMessage.New<any>(PacketKind.Password, { Password: this.State.Password, RoomName: roomName })
		);
	}

	public SetUsername(value: string): void {
		this.Update((e) => (e.PlayerName = value.substring(0, 15)));
	}

	public SetFilter(value: string): void {
		this.Update((e) => (e.filter = value));
	}

	public SetPassword(value: string): void {
		this.Update((e) => (e.Password = value));
	}

	public Randomize(): void {
		this.Update((e) => {
			e.PlayerName = Usernames[Math.round(Math.random() * Usernames.length - 1)];
		});
	}

	public Back() {
		route('{{sub_path}}Home', true);
	}

	public Refresh() {
		this._socket.Emit(NetworkMessage.New<string>(PacketKind.Rooms, this.State.filter));
	}

	public OnAvailable(message: NetworkMessage<{ IsAvailable: boolean; RoomName: string }>): void {
		if (message.Content.IsAvailable) {
			Singletons.Load<IOnlineService>(SingletonKey.Online).Register(
				this.State.PlayerName,
				message.Content.RoomName,
				this.State.Password ? this.State.Password : undefined,
				false
			);
			route('{{sub_path}}Lobby', true);
		} else {
			this.OnNotification.Invoke(
				this,
				new NotificationState(
					LogKind.warning,
					`${this.State.PlayerName} is already used in ${message.Content.RoomName}`
				)
			);
		}
	}

	private OnRoom(message: NetworkMessage<RoomState[]>): void {
		this.Update((data) => {
			data.Rooms = message.Content;
		});
	}

	private OnConnect(m: NetworkMessage<any>): void {
		this._socket.Emit(NetworkMessage.New<string>(PacketKind.Rooms, this.State.filter));
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
				new NotificationState(
					LogKind.warning,
					`${this.State.Password} doesn't match ${m.Content.RoomName}'s password`
				)
			);
		}
	}

	private OnConnectError(m: any): void {
		this.OnNotification.Invoke(this, new NotificationState(LogKind.error, ServerIssue));
	}
}
