import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { NetworkObserver } from '../../Utils/Events/NetworkObserver';
import { IServerSocket } from '../../Network/Socket/Server/IServerSocket';
import { ISocketService } from '../../Services/Socket/ISocketService';
import { PacketKind } from '../../Network/Message/PacketKind';
import { LogKind } from '../../Utils/Logger/LogKind';
import { NetworkMessage } from '../../Network/Message/NetworkMessage';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import { Singletons, SingletonKey } from '../../Singletons';
import { HostState } from '../Model/HostState';
import { NotificationItem } from '../Components/Notification/NotificationItem';
import { Hook } from './Hook';
import { route } from 'preact-router';
import { StateUpdater } from 'preact/hooks';
import { Usernames } from '../Model/Names';

export class CreateHostHook extends Hook<HostState> {
	private _socket: IServerSocket;
	private _obs: NetworkObserver[];
	public OnNotification: LiteEvent<NotificationItem> = new LiteEvent<NotificationItem>();

	constructor(data: HostState, protected SetState: StateUpdater<HostState>) {
		super(data, SetState);
		this._socket = Singletons.Load<ISocketService>(SingletonKey.Socket).Publish();
		this._obs = [
			new NetworkObserver(PacketKind.Exist, this.OnExist.bind(this)),
			new NetworkObserver(PacketKind.connect_error, this.OnError.bind(this))
		];
		this._socket.On(this._obs);
	}

	public Unmount(): void {
		this._socket.Off(this._obs);
	}

	public static DefaultState(): HostState {
		const profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		return new HostState(
			`${profilService.GetProfil().LastPlayerName}'s room`,
			profilService.GetProfil().LastPlayerName,
			'',
			false
		);
	}

	public Start(): void {
		this._socket.Emit(NetworkMessage.New(PacketKind.Exist, { RoomName: this.State.RoomName }));
	}

	public Randomize(): void {
		const username = Usernames[Math.round(Math.random() * Usernames.length - 1)];
		this.SetProp((e) => {
			e.PlayerName = username;
			e.RoomName = `${username}'s room`;
		});
	}

	public SetRoomname(value: string): void {
		this.SetProp((e) => (e.RoomName = value.substring(0, 15)));
	}

	public SetUsername(value: string): void {
		this.SetProp((e) => (e.PlayerName = value.substring(0, 15)));
	}

	public SetPassword(value: string): void {
		this.SetProp((e) => (e.PlayerName = value.substring(0, 15)));
	}

	public HasPassword(): void {
		this.SetProp((e) => (e.HasPassword = !e.HasPassword));
	}

	public Back(): void {
		route('{{sub_path}}Home', true);
	}

	private OnExist(message: NetworkMessage<{ Exist: boolean; RoomName: string }>): void {
		if (!message.Content.Exist) {
			Singletons.Load<IOnlineService>(SingletonKey.Online).Register(
				this.State.PlayerName,
				this.State.RoomName,
				this.State.Password === undefined ? '' : this.State.Password,
				this.State.HasPassword === undefined ? false : this.State.HasPassword,
				true
			);
			route('{{sub_path}}Lobby', true);
		} else {
			this.OnNotification.Invoke(
				this,
				new NotificationItem(LogKind.warning, `${message.Content.RoomName} is already used.`)
			);
		}
	}

	private OnError(message: NetworkMessage<any>): void {
		this.OnNotification.Invoke(
			this,
			new NotificationItem(LogKind.error, `OOPS Server doesn't seem to be running.`)
		);
	}
}
