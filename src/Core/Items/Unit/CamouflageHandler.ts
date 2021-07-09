import { IBlueprint } from './../../Framework/Blueprint/IBlueprint';
import { IKeyService } from './../../../Services/Key/IKeyService';
import { Singletons, SingletonKey } from '../../../Singletons';
import { IAppService } from '../../../Services/App/IAppService';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { MapKind } from '../../Framework/Blueprint/Items/MapKind';

export class CamouflageHandler {
	private _appService: IAppService<IBlueprint>;

	constructor() {
		const key = Singletons.Load<IKeyService>(SingletonKey.Key).GetAppKey();
		this._appService = Singletons.Load<IAppService<IBlueprint>>(key);
	}

	public GetCamouflage(): string {
		const random = Math.floor(Math.random() * 2) + 1;
		if (this._appService.Context().MapMode === MapKind.Forest) {
			return random === 1 ? SvgArchive.nature.forest.tree : SvgArchive.nature.forest.rock;
		} else if (this._appService.Context().MapMode === MapKind.Sand) {
			return random === 1 ? SvgArchive.nature.sand.rock : SvgArchive.nature.sand.palmTree;
		} else if (this._appService.Context().MapMode === MapKind.Ice) {
			return random === 1 ? SvgArchive.nature.ice.tree : SvgArchive.nature.ice.rock;
		}
	}
}
