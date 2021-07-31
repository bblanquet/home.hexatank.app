import { Brain } from '../../../Brain';
import { IaArea } from '../../../Utils/IaArea';
import { IGlobalCondition } from '../IGlobalCondition';

export class GeneralTruckCondition implements IGlobalCondition {
	Condition(brain: Brain): IaArea {
		const kingdomAreas = brain.AreaDecisions.map((a) => a);
		const farmAreas = kingdomAreas.filter((a) => a.HasFarmField());
		if (0 < farmAreas.length && brain.Trucks.length * 2 <= farmAreas.length) {
			return farmAreas[0];
		}
		return null;
	}
}
