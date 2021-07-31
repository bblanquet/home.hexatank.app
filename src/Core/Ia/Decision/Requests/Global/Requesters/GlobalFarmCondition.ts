import { Brain } from '../../../Brain';
import { GlobalRequestResult } from '../GlobalRequestResult';
import { IGlobalCondition } from '../IGlobalCondition';

export class GlobalFarmCondition implements IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult {
		const farmCount = brain.BrainAreas.reduce((result, area) => result + area.GetFarmCount(), 0);
		const emptyAreas = brain.BrainAreas.filter((a) => 0 < a.GetFreeCoveredCells().length);
		if (0 < emptyAreas.length && farmCount < brain.BrainAreas.length / 2) {
			return new GlobalRequestResult(true, emptyAreas[0]);
		} else {
			return new GlobalRequestResult(false, null);
		}
	}
}
