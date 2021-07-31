import { IaArea } from '../../Utils/IaArea';
import { Brain } from '../../Brain';
import { IAreaCondition } from '../IAreaCondition';
export class HealUpCondition implements IAreaCondition {
	constructor(private _kingdom: Brain) {}
	Condition(area: IaArea): boolean {
		if (area.GetInnerFoeCount() === 0) {
			const hasHealing = this._kingdom.GetIaAreaByCell().Values().some((a) => a.HasMedic());
			if (
				hasHealing &&
				area.GetFoesCount() === 0 &&
				!area.HasMedic() &&
				area.GetTroops().some((t) => t.HasDamage())
			) {
				return true;
			}
		}
		return false;
	}
}
