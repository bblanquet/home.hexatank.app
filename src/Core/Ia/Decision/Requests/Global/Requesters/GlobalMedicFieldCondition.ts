import { Brain } from '../../../Brain';
import { GlobalRequestResult } from '../GlobalRequestResult';
import { IGlobalCondition } from '../IGlobalCondition';

export class GlobalMedicFieldCondition implements IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult {
		const medicCount = brain.BrainAreas.reduce((result, area) => result + area.GetMedicCount(), 0);
		const emptyAreas = brain.BrainAreas.filter((a) => a.GetFreeCoveredCells().length > 0);
		if (0 < emptyAreas.length && medicCount < brain.BrainAreas.length / 4) {
			return new GlobalRequestResult(true, emptyAreas[0]);
		} else {
			return new GlobalRequestResult(false, null);
		}
	}
}
