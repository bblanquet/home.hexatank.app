import { IaArea } from '../../../Utils/IaArea';
import { IAreaCondition } from '../../IAreaCondition';

export class FarmFieldCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		if (area.GetInnerFoeCount() === 0) {
			if (
				!area.IsImportant() &&
				0 < area.GetFreeCoveredCells().length &&
				!area.HasFarmField() &&
				area.HasRoadField()
			) {
				return true;
			}
		}
		return false;
	}
}
