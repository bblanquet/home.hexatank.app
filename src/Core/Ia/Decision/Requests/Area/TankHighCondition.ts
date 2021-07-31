import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';

export class TankHighCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		const foes = area.GetFoesCount();
		if (area.Tanks.length <= foes) {
			let requestTroops = area.Tanks.length - area.GetFoesCount();
			if (0 <= requestTroops) {
				if (0 < area.GetInnerFoeCount()) {
					return true;
				}
			}
		} else if (area.Tanks.length === 0 && area.HasNature()) {
			return true;
		}
		return false;
	}
}
