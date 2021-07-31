import { Brain } from '../../../Brain';
import { GlobalRequestResult } from '../GlobalRequestResult';
import { IGlobalCondition } from '../IGlobalCondition';

export class GlobalMedicFieldCondition implements IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult {
		const iaAreas = brain.AreaDecisions.map((a) => a);
		const candidates = iaAreas.filter(
			(a) => !a.IsImportant() && a.HasFreeFields() && a.HasRoadField() && a.GetInnerFoeCount() === 0
		);
		const medicAreas = iaAreas.filter((a) => a.HasMedic());
		const total = Math.floor(iaAreas.length / 8);

		if (medicAreas.length < total && 0 < candidates.length) {
			return new GlobalRequestResult(true, medicAreas[0]);
		}
		return new GlobalRequestResult(false, null);
	}
}
