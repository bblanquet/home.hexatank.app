import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { NetworkObserver } from '../../Utils/Events/NetworkObserver';
import { IServerSocket } from '../../Network/Socket/Server/IServerSocket';
import { ISocketService } from '../../Services/Socket/ISocketService';
import { PacketKind } from '../../Network/Message/PacketKind';
import { LogKind } from '../../Utils/Logger/LogKind';
import { NetworkMessage } from '../../Network/Message/NetworkMessage';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { Singletons, SingletonKey } from '../../Singletons';
import { HostState } from '../Model/HostState';
import { NotificationState } from '../Model/NotificationState';
import { Hook } from '../Framework/Hook';
import { route } from 'preact-router';
import { StateUpdater } from 'preact/hooks';
import { Usernames } from '../Model/Names';
import { ServerIssue } from '../Model/Dialogues';

export class HostHook extends Hook<HostState> {
	private _socket: IServerSocket;
	private _obs: NetworkObserver[];
	public OnNotification: LiteEvent<NotificationState> = new LiteEvent<NotificationState>();
	private _playerSvc: IPlayerProfileService;

	constructor(d: [HostState, StateUpdater<HostState>]) {
		super(d[0], d[1]);
		this._socket = Singletons.Load<ISocketService>(SingletonKey.Socket).Publish();
		this._obs = [
			new NetworkObserver(PacketKind.Exist, this.OnExist.bind(this)),
			new NetworkObserver(PacketKind.Error, this.OnWrong.bind(this)),
			new NetworkObserver(PacketKind.connect_error, this.OnError.bind(this))
		];
		this._socket.On(this._obs);
		this._playerSvc = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
	}

	public Unmount(): void {
		this._socket.Off(this._obs);
	}

	public static DefaultState(): HostState {
		const profileSvc = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		return new HostState(
			`${profileSvc.GetProfile().Details.name} party`,
			profileSvc.GetProfile().Details.name,
			'',
			false
		);
	}

	public GetName(): string {
		return this._playerSvc.GetProfile().Details.name;
	}
	public IsLogged(): boolean {
		return this._playerSvc.HasToken();
	}

	public Start(): void {
		this._socket.Emit(
			NetworkMessage.New(PacketKind.Exist, { RoomName: this.State.RoomName, PlayerName: this.State.PlayerName })
		);
	}

	public Randomize(): void {
		const username = Usernames[Math.round(Math.random() * Usernames.length - 1)];
		this.Update((e) => {
			e.PlayerName = username;
			e.RoomName = `${username} party`;
		});
	}

	public SetRoomname(value: string): void {
		this.Update((e) => (e.RoomName = value.substring(0, 15)));
	}

	public SetUsername(value: string): void {
		if (!this.IsLogged()) {
			this.Update((e) => (e.PlayerName = value.substring(0, 15)));
		}
	}

	public SetPassword(value: string): void {
		this.Update((e) => (e.Password = value.substring(0, 15)));
	}

	public HasPassword(): void {
		this.Update((e) => (e.HasPassword = !e.HasPassword));
	}

	public Back(): void {
		this._socket.Close();
		route('{{sub_path}}Home', true);
	}

	private OnWrong(message: NetworkMessage<string>): void {
		this.OnNotification.Invoke(this, new NotificationState(LogKind.warning, message.Content));
	}

	private OnExist(message: NetworkMessage<{ Exist: boolean; RoomName: string }>): void {
		if (!message.Content.Exist) {
			Singletons.Load<IOnlineService>(SingletonKey.Online).Register(
				this.State.PlayerName,
				this.State.RoomName,
				this.State.Password ? this.State.Password : undefined,
				true
			);
			route('{{sub_path}}Lobby', true);
		} else {
			this.OnNotification.Invoke(
				this,
				new NotificationState(LogKind.warning, `${message.Content.RoomName} is already used.`)
			);
		}
	}

	private OnError(message: NetworkMessage<any>): void {
		this.OnNotification.Invoke(this, new NotificationState(LogKind.error, ServerIssue));
	}
}
