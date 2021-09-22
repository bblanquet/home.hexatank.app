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
import { AuthentificateRequest } from '../../Services/PlayerProfil/AuthentificateRequest';
import { AuthentificateResponse } from '../../Services/PlayerProfil/AuthentificateResponse';
import { Versionning } from '../Model/Versionning';
import { PlayerDetails } from '../../Services/PlayerProfil/PlayerDetails';
import { IApiService } from '../../Services/PlayerProfil/IApiService';
import { ApiError } from '../../Services/PlayerProfil/ApiService';

export class HomeHook extends Hook<HomeState> {
	private _playerSvc: IPlayerProfileService;
	private _audioSvc: IAudioService;
	private _apiSvc: IApiService;
	private _versionSvc: IVersionService;

	constructor(data: HomeState, protected SetState: StateUpdater<HomeState>) {
		super(data, SetState);
		this._playerSvc = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._audioSvc = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._apiSvc = Singletons.Load<IApiService>(SingletonKey.Api);
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
		this._apiSvc.Get<void, number>(
			'Player/rank',
			null,
			(value: number) => {
				this.Update((e) => {
					e.Rank = value.toString();
				});
			},
			(e: ApiError) => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.error, e.name));
			}
		);
	}

	public SignIn(): void {
		this._apiSvc.Post<AuthentificateRequest, AuthentificateResponse>(
			'Authentification/signIn',
			new AuthentificateRequest(this.State.Name, this.State.Password),
			(r: AuthentificateResponse) => {
				this._playerSvc.SetToken(r.name, r.token);
				this.Update((e) => {
					e.Password = '';
				});
				this.SetDetails();
				this.UpdateRank();
			},
			(e: ApiError) => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.error, e.name));
			}
		);
	}

	private CheckTokenValidity(): void {
		this._apiSvc.Get<{ token: string }, boolean>(
			'Authentification/isValid',
			{ token: this._playerSvc.GetProfile().Token.data },
			(isValid: boolean) => {
				if (isValid) {
					this.UpdateRank();
				} else {
					this.LogOut();
				}
			},
			(er: ApiError) => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.error, er.name));
			}
		);
	}

	private SetDetails() {
		this._apiSvc.Get<void, PlayerDetails>(
			'Player/details',
			null,
			(r: PlayerDetails) => {
				this._playerSvc.SetDetails(r);
			},
			(err: ApiError) => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.error, err.name));
			}
		);
	}

	public SignUp(): void {
		this._apiSvc.Post<AuthentificateRequest, AuthentificateResponse>(
			'Authentification/signUp',
			new AuthentificateRequest(this.State.Name, this.State.Password),
			(r: AuthentificateResponse) => {
				this._playerSvc.SetToken(r.name, r.token);
				this.Update((e) => {
					e.Password = '';
				});
			},
			(err: ApiError) => {
				this.State.Notification.Invoke(this, new NotificationState(LogKind.error, err.name));
			}
		);
	}

	public Unmount(): void {}
}
