import { Brain } from '../../../Brain';
import { IaArea } from '../../../Utils/IaArea';
import { IGlobalCondition } from '../IGlobalCondition';

export class GlobalHealUpCondition implements IGlobalCondition {
	Condition(brain: Brain): IaArea {
		const kingdomAreas = brain.AreaDecisions.map((a) => a);
		const candidates = kingdomAreas.filter(
			(a) => !a.IsImportant() && a.HasFreeFields() && a.HasRoadField() && a.GetInnerFoeCount() === 0
		);
		const healingArea = kingdomAreas.filter((a) => a.HasMedic());
		const total = Math.floor(kingdomAreas.length / 8);

		if (healingArea.length < total && 0 < candidates.length) {
			return healingArea[0];
		}
		return null;
	}
}
