import { Hook } from '../Framework/Hook';
import { HomeState } from '../Model/HomeState';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IPlayerProfileService } from '../../Services/PlayerProfil/IPlayerProfileService';
import { Singletons, SingletonKey } from '../../Singletons';
import { IVersionService } from '../../Services/Version/IVersionService';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { NotificationState } from '../Model/NotificationState';
import { Home } from '../Model/Dialogues';
import { LogKind } from '../../Utils/Logger/LogKind';
import { StateUpdater } from 'preact/hooks';
import { HomeKind } from '../Model/HomeKind';
import { Versionning } from '../Model/Versionning';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { PlayerDetails } from '../../Services/PlayerProfil/PlayerDetails';

export class HomeHook extends Hook<HomeState> {
	private _playerSvc: IPlayerProfileService;
	private _audioSvc: IAudioService;
	private _versionSvc: IVersionService;

	constructor(data: HomeState, protected SetState: StateUpdater<HomeState>) {
		super(data, SetState);
		this._playerSvc = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._audioSvc = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._versionSvc = Singletons.Load<IVersionService>(SingletonKey.Version);
		this._audioSvc.SetMute(this._playerSvc.GetProfile().IsMute);
		this.Update((e) => {
			e.Kind = HomeKind.Home;
			e.Notification = new LiteEvent<NotificationState>();
		});
		if (this._playerSvc.GetPoints() < 30) {
			setTimeout(() => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.message, Home));
			}, 300);
		}

		if (this._playerSvc.HasToken()) {
			this.CheckTokenValidity();
		}
	}

	public SetKind(kind: HomeKind): void {
		this.Update((e) => {
			e.Kind = kind;
		});
	}

	public GetVersion(): string {
		return this._versionSvc.GetVersionNumber();
	}

	public GetVersions(): Versionning[] {
		return this._versionSvc.GetVersions();
	}

	static DefaultState(): HomeState {
		return new HomeState();
	}

	public LogOut() {
		this._playerSvc.Clear();
		this.Update((e) => {
			e.Name = '';
			e.Password = '';
		});
	}

	public HasToken(): boolean {
		return this._playerSvc.HasToken();
	}

	public GetName(): string {
		return this._playerSvc.GetProfile().Details.name;
	}

	public SetPassword(value: string): void {
		this.Update((e) => {
			e.Password = value;
		});
	}
	public SetName(value: string): void {
		this.Update((e) => {
			e.Name = value;
		});
	}

	public UpdateRank(): void {
		axios
			.get('{{server}}/Player/rank', {
				headers: { Authorization: `Bearer ${this._playerSvc.GetProfile().Token}` }
			})
			.then((response: AxiosResponse<number>) => {
				this.Update((e) => {
					e.Rank = response.data.toString();
				});
			});
	}

	public SignIn(): void {
		axios
			.post('{{server}}/Authentification/signIn', {
				name: this.State.Name,
				password: this.State.Password
			})
			.then((response: AxiosResponse<{ name: string; token: string }>) => {
				const profile = this._playerSvc.GetProfile();
				profile.Token = response.data.token;
				profile.Details.name = response.data.name;
				this._playerSvc.Save();
				this.Update((e) => {
					e.Password = '';
				});
				this.SetDetails();
				this.UpdateRank();
			})
			.catch((error: AxiosError<any>) => {
				if (error.response && error.response.data.message) {
					this.State.Notification.Invoke(
						this,
						new NotificationState(LogKind.error, error.response.data.message)
					);
				} else {
					this.State.Notification.Invoke(this, new NotificationState(LogKind.error, error.message));
				}
			});
	}

	private CheckTokenValidity(): void {
		const profile = this._playerSvc.GetProfile();
		axios
			.get('{{server}}/Authentification/isValid', {
				params: { token: profile.Token }
			})
			.then((response: AxiosResponse<boolean>) => {
				if (response.data) {
					this.UpdateRank();
				} else {
					this.LogOut();
				}
			});
	}

	private SetDetails() {
		const profile = this._playerSvc.GetProfile();
		axios
			.get('{{server}}/Player/details', { headers: { Authorization: `Bearer ${profile.Token}` } })
			.then((response: AxiosResponse<PlayerDetails>) => {
				profile.Details = response.data;
				this._playerSvc.Save();
			});
	}

	public SignUp(): void {
		axios
			.post('{{server}}/Authentification/signUp', {
				name: this.State.Name,
				password: this.State.Password
			})
			.then((response: AxiosResponse<{ name: string; token: string }>) => {
				const profile = this._playerSvc.GetProfile();
				profile.Token = response.data.token;
				profile.Details.name = response.data.name;
				this._playerSvc.Save();
				this.Update((e) => {
					e.Password = '';
				});
			})
			.catch((error: AxiosError) => {
				if (error.response && error.response.data.message) {
					this.State.Notification.Invoke(
						this,
						new NotificationState(LogKind.error, error.response.data.message)
					);
				} else {
					this.State.Notification.Invoke(this, new NotificationState(LogKind.error, error.message));
				}
			});
	}

	public Unmount(): void {}
}
