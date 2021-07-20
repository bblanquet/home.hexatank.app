import { IGeneralRequester } from '../IGeneralRequester';
import { Brain } from '../../../Brain';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';
import { GameSettings } from '../../../../../Framework/GameSettings';

export class GeneralSquadRequest implements IGeneralRequester {
	constructor(private _priority: number, private _duration: number, private _tankCount: number) {}

	GetResquest(global: Brain): AreaRequest {
		if (global.Hq.GetEarnedDiamond(this._duration) > GameSettings.TankPrice * this._tankCount) {
			if (global.GetIaAreaByCell().Values().filter((a) => a.HasTank()).length >= this._tankCount * 2) {
				return new AreaRequest(RequestType.Raid, this._priority.toString(), this._tankCount, null);
			}
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
