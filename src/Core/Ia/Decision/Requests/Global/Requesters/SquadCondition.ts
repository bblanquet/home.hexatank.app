import { Brain } from '../../../Brain';
import { GameSettings } from '../../../../../Framework/GameSettings';
import { IGlobalCondition } from '../IGlobalCondition';
import { IaArea } from '../../../Utils/IaArea';
import { GlobalRequestResult } from '../GlobalRequestResult';

export class SquadCondition implements IGlobalCondition {
	constructor(private _duration: number, private _tankCount: number) {}
	Condition(brain: Brain): GlobalRequestResult {
		if (brain.Hq.GetEarnedDiamond(this._duration) > GameSettings.TankPrice * this._tankCount) {
			if (brain.GetIaAreaByCell().Values().filter((a) => a.HasTank()).length >= this._tankCount * 2) {
				return new GlobalRequestResult(true, null);
			}
		}
		return new GlobalRequestResult(false, null);
	}
}
