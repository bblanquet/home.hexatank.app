import { TimeTimer } from '../../../../../../Utils/Timer/TimeTimer';
import { Brain } from '../../../Brain';
import { IaArea } from '../../../Utils/IaArea';
import { GlobalRequestResult } from '../GlobalRequestResult';
import { IGlobalCondition } from '../IGlobalCondition';

export class SimpleSquadCondition implements IGlobalCondition {
	private _timeTime: TimeTimer;
	constructor() {
		this._timeTime = new TimeTimer(4000);
	}
	Condition(brain: Brain): GlobalRequestResult {
		if (this._timeTime.IsElapsed()) {
			return new GlobalRequestResult(true, null);
		}
		return new GlobalRequestResult(false, null);
	}
}
