import { IAreaRequestMaker } from './../RequestMaker/IAreaRequestMaker';
export interface IRequestMakerProvider {
	Get(): IAreaRequestMaker[];
}
