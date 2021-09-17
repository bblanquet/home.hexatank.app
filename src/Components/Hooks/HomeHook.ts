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

export class HomeHook extends Hook<HomeState> {
	private _playerProfile: IPlayerProfileService;
	private _audio: IAudioService;
	private _version: IVersionService;

	constructor(data: HomeState, protected SetState: StateUpdater<HomeState>) {
		super(data, SetState);
		this._playerProfile = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._audio = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._version = Singletons.Load<IVersionService>(SingletonKey.Version);
		this._audio.SetMute(this._playerProfile.GetProfile().IsMute);
		this.Update((e) => {
			e.Kind = HomeKind.Home;
			e.Notification = new LiteEvent<NotificationState>();
		});
		if (this._playerProfile.GetPoints() < 30) {
			setTimeout(() => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.message, Home));
			}, 300);
		}
	}

	public SetKind(kind: HomeKind): void {
		this.Update((e) => {
			e.Kind = kind;
		});
	}

	public GetVersion(): string {
		return this._version.GetVersionNumber();
	}

	public GetVersions(): Versionning[] {
		return this._version.GetVersions();
	}

	static DefaultState(): HomeState {
		return new HomeState();
	}

	public HasToken(): boolean {
		return this._playerProfile.GetProfile().Token !== undefined;
	}

	public SignIn(): void {
		axios
			.post('{{server}}/Player/signIn', {
				name: this.State.Name,
				password: this.State.Password
			})
			.then((response: AxiosResponse<{ name: string; token: string }>) => {
				const profile = this._playerProfile.GetProfile();
				profile.Token = response.data.token;
				profile.LastPlayerName = response.data.name;
				this._playerProfile.Save();
				this.Update((e) => {
					e.Name = '';
					e.Password = '';
				});
				axios
					.get('{{server}}/Player/score', { headers: { Authorization: `Bearer ${profile.Token}}` } })
					.then((response: AxiosResponse<{ score: number }>) => {
						profile.Points = response.data.score;
						this._playerProfile.Save();
					});
			})
			.catch((error: AxiosError) => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.error, error.message));
			});
	}

	public SignUp() {
		axios
			.post('{{server}}/Player/signUp', {
				name: this.State.Name,
				password: this.State.Password
			})
			.then((response: AxiosResponse<{ name: string; token: string }>) => {
				const profile = this._playerProfile.GetProfile();
				profile.Token = response.data.token;
				profile.LastPlayerName = response.data.name;
				this._playerProfile.Save();
				this.Update((e) => {
					e.Name = '';
					e.Password = '';
				});
			})
			.catch((error: AxiosError) => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.error, error.message));
			});
	}

	public Unmount(): void {}
}
