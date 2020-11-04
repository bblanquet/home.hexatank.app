import { IModelService } from './IModelService';
import { Model } from './Model';

export class ModelService implements IModelService {
	private _model: Model;

	constructor() {
		this._model = new Model();
	}

	SetModel(model: Model): void {
		this._model = model;
	}
	GetModel(): Model {
		return this._model;
	}
}
