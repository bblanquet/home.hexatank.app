import { IGeneralRequester } from './../RequestMaker/GeneralRequester/IGeneralRequester';
export interface IGeneralRequetProvider {
	Get(): IGeneralRequester[];
}
