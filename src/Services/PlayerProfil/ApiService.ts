import axios, { AxiosError, AxiosResponse } from 'axios';
import { Singletons, SingletonKey } from '../../Singletons';
import { IApiService } from './IApiService';
import { IPlayerProfileService } from './IPlayerProfileService';
import { PlayerDetails } from './PlayerDetails';

export class ApiService implements IApiService {
	private _playerSvc: IPlayerProfileService;
	private _api: string = '{{server}}';

	constructor() {
		this._playerSvc = Singletons.Load<IPlayerProfileService>(SingletonKey.PlayerProfil);
		this._playerSvc.OnUpdated.On(() => {
			this.Update();
		});
	}

	private Update(): void {
		const profile = this._playerSvc.GetProfile();
		if (this._playerSvc.HasToken()) {
			try {
				this.Post<PlayerDetails, {}>('Player/update', profile.Details, (r: {}) => {}, (r: ApiError) => {});
			} catch (error) {}
		}
	}

	public Post<T1, T2>(route: string, body: T1, resultFunc: (e: T2) => void, errorFunc: (e: ApiError) => void): void {
		const conf: any = { headers: { Authorization: '' } };

		if (this._playerSvc.HasToken()) {
			conf.headers.Authorization = `Bearer ${this._playerSvc.GetProfile().Token.data}`;
		}

		axios
			.post(`${this._api}/${route}`, body, conf)
			.then((response: AxiosResponse<T2>) => {
				resultFunc(response.data);
			})
			.catch((error: AxiosError<ApiError>) => {
				if (
					error.response &&
					error.response.data &&
					error.response.data.description &&
					error.response.data.name
				) {
					errorFunc(error.response.data);
				} else {
					const err = new ApiError();
					err.name = error.name + ' - ' + error.message;
					err.description = '';
					errorFunc(err);
				}
			});
	}

	public Get<T1, T2>(route: string, params: T1, resultFunc: (e: T2) => void, errorFunc: (e: ApiError) => void): void {
		const conf: any = { headers: { Authorization: '' }, params: {} };

		if (this._playerSvc.HasToken()) {
			conf.headers.Authorization = `Bearer ${this._playerSvc.GetProfile().Token.data}`;
		}

		conf.params = params;

		axios
			.get(`${this._api}/${route}`, conf)
			.then((response: AxiosResponse<T2>) => {
				resultFunc(response.data);
			})
			.catch((error: AxiosError<ApiError>) => {
				if (
					error.response &&
					error.response.data &&
					error.response.data.description &&
					error.response.data.name
				) {
					errorFunc(error.response.data);
				} else {
					const err = new ApiError();
					err.name = error.name + ' - ' + error.message;
					err.description = '';
					errorFunc(err);
				}
			});
	}
}

export class ApiError {
	public name: string;
	public description: string;
}
