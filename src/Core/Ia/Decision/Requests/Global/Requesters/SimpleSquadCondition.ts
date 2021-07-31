import { TimeTimer } from '../../../../../../Utils/Timer/TimeTimer';
import { Brain } from '../../../Brain';
import { IaArea } from '../../../Utils/IaArea';
import { IGlobalCondition } from '../IGlobalCondition';

export class SimpleSquadCondition implements IGlobalCondition {
	private _timeTime: TimeTimer;
	constructor() {
		this._timeTime = new TimeTimer(4000);
	}
	Condition(brain: Brain): IaArea {
		if (this._timeTime.IsElapsed()) {
			return brain.CellAreas.GetFromIndex(0);
		}
		return null;
	}
}
