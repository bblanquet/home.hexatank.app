import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';

export class TankMediumCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		const foes = area.GetFoesCount();

		if (area.Tanks.length <= foes) {
			let requestTroops = area.Tanks.length - area.GetFoesCount();

			if (0 <= requestTroops) {
				const freeCells = area.GetFreeUnitCellCount();

				if (freeCells < requestTroops) {
					requestTroops = freeCells;
				}

				if (area.Tanks.length < area.GetOuterFoeCount()) {
					return true;
				}
			}
		}
		return false;
	}
}
