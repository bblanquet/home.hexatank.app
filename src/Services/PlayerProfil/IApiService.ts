import { ApiError } from './ApiService';

export interface IApiService {
	Post<T1, T2>(route: string, body: T1, result: (r: T2) => void, errorCallback: (e: ApiError) => void): void;
	Get<T1, T2>(route: string, params: T1, result: (r: T2) => void, errorCallback: (e: ApiError) => void): void;
}
