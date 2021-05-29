import { Factory, FactoryKey } from './../../../Factory';
import { IAppService } from '../../../Services/App/IAppService';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { MapEnv } from '../../Setup/Blueprint/MapEnv';
import { GameBlueprint } from '../../Setup/Blueprint/Game/GameBlueprint';

export class CamouflageHandler {
	private _appService: IAppService<GameBlueprint>;

	constructor() {
		this._appService = Factory.Load<IAppService<GameBlueprint>>(FactoryKey.App);
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
