import { Brain } from '../../../Brain';
import { GlobalRequestResult } from '../GlobalRequestResult';
import { IGlobalCondition } from '../IGlobalCondition';

export class GeneralTruckCondition implements IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult {
		const farmAreas = brain.AreaDecisions.filter((a) => a.HasFarmField());
		const emptyAreas = brain.AreaDecisions.filter((a) => a.GetFreeCoveredCells().length > 0);
		if (0 < emptyAreas.length && 0 < farmAreas.length && brain.Trucks.length * 2 <= farmAreas.length) {
			return new GlobalRequestResult(true, emptyAreas[0]);
		} else {
			return new GlobalRequestResult(false, null);
		}
	}
}
