import { lazyInject } from '../../../inversify.config';
import { TYPES } from '../../../types';
import { IAppService } from '../../../Services/App/IAppService';
import { Archive } from '../../Framework/ResourceArchiver';
import { MapEnv } from '../../Setup/Generator/MapEnv';

export class CamouflageHandler {
	@lazyInject(TYPES.Empty) private _appService: IAppService;

	public GetCamouflage(): string {
		const random = Math.floor(Math.random() * 2) + 1;
		if (this._appService.Context().MapMode === MapEnv.forest) {
			return random === 1 ? Archive.nature.tree : Archive.nature.rock;
		} else if (this._appService.Context().MapMode === MapEnv.sand) {
			return random === 1 ? Archive.nature.sandRock : Archive.nature.palmTree;
		} else if (this._appService.Context().MapMode === MapEnv.ice) {
			return random === 1 ? Archive.nature.iceTree : Archive.nature.rock;
		}
	}
}
