import { BrainArea } from '../../Utils/BrainArea';
import { Brain } from '../../Brain';
import { IAreaCondition } from '../IAreaCondition';
export class FindMedicFieldCondition implements IAreaCondition {
	constructor(private _kingdom: Brain) {}
	Condition(area: BrainArea): boolean {
		if (area.GetInnerFoeCount() === 0) {
			const hasMedicField = this._kingdom.BrainAreas.some((a) => a.HasMedic());
			if (
				hasMedicField &&
				!area.HasMedic() &&
				area.GetFoesCount() === 0 &&
				area.Tanks.some((t) => t.HasDamage())
			) {
				return true;
			}
		}
		return false;
	}
}
