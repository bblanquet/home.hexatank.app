import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { IBlueprintService } from './IBlueprintService';

export class BlueprintService implements IBlueprintService {
	private _blueprint: IBlueprint;
	Register(blueprint: IBlueprint): void {
		this._blueprint = blueprint;
	}
	Get(): IBlueprint {
		return this._blueprint;
	}
}
