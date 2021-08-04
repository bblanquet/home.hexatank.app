import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';

export interface IBlueprintService {
	Register(blueprint: IBlueprint): void;
	Get(): IBlueprint;
}
