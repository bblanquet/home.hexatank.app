import { IaArea } from '../../../Utils/IaArea';
import { IAreaCondition } from '../../IAreaCondition';
export class BasicFarmFieldCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		if (area.GetInnerFoeCount() === 0 && 0 < area.GetFreeCoveredCells().length) {
			if (!area.IsImportant() && area.HasFreeFields() && !area.HasFarmField()) {
				return true;
			}
		}
		return false;
	}
}
