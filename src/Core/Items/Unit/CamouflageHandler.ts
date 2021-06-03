import { IBlueprint } from './../../Setup/Blueprint/IBlueprint';
import { IKeyService } from './../../../Services/Key/IKeyService';
import { Singletons, SingletonKey } from '../../../Singletons';
import { IAppService } from '../../../Services/App/IAppService';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { MapEnv } from '../../Setup/Blueprint/MapEnv';

export class CamouflageHandler {
	private _appService: IAppService<IBlueprint>;

	constructor() {
		const key = Singletons.Load<IKeyService>(SingletonKey.Key).GetAppKey();
		this._appService = Singletons.Load<IAppService<IBlueprint>>(key);
	}

	public GetCamouflage(): string {
		const random = Math.floor(Math.random() * 2) + 1;
		if (this._appService.Context().MapMode === MapEnv.forest) {
			return random === 1 ? SvgArchive.nature.tree : SvgArchive.nature.rock;
		} else if (this._appService.Context().MapMode === MapEnv.sand) {
			return random === 1 ? SvgArchive.nature.sandRock : SvgArchive.nature.palmTree;
		} else if (this._appService.Context().MapMode === MapEnv.ice) {
			return random === 1 ? SvgArchive.nature.iceTree : SvgArchive.nature.rock;
		}
	}
}
