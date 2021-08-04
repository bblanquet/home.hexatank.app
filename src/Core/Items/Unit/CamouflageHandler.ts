import { Singletons, SingletonKey } from '../../../Singletons';
import { IBlueprintService } from '../../../Services/Blueprint/IBlueprintService';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { MapKind } from '../../Framework/Blueprint/Items/MapKind';

export class CamouflageHandler {
	private _blueprintService: IBlueprintService;

	constructor() {
		this._blueprintService = Singletons.Load<IBlueprintService>(SingletonKey.Blueprint);
	}

	public GetCamouflage(): string {
		const random = Math.floor(Math.random() * 2) + 1;
		if (this._blueprintService.Get().MapMode === MapKind.Forest) {
			return random === 1 ? SvgArchive.nature.forest.tree : SvgArchive.nature.forest.rock;
		} else if (this._blueprintService.Get().MapMode === MapKind.Sand) {
			return random === 1 ? SvgArchive.nature.sand.rock : SvgArchive.nature.sand.palmTree;
		} else if (this._blueprintService.Get().MapMode === MapKind.Ice) {
			return random === 1 ? SvgArchive.nature.ice.tree : SvgArchive.nature.ice.rock;
		}
	}
}
