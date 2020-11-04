import { Model } from './Model';

export interface IModelService {
	SetModel(model: Model): void;
	GetModel(): Model;
}
