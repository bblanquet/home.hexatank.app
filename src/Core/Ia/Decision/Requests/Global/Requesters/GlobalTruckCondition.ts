import { Brain } from '../../../Brain';
import { GlobalRequestResult } from '../GlobalRequestResult';
import { IGlobalCondition } from '../IGlobalCondition';

export class GlobalTruckCondition implements IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult {
		if (brain.Trucks.length === 0) {
			return new GlobalRequestResult(true, null);
		} else {
			return new GlobalRequestResult(false, null);
		}
	}
}
