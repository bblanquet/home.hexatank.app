import { BrainArea } from '../../../Utils/BrainArea';
import { IAreaCondition } from '../../IAreaCondition';
export class BasicFarmFieldCondition implements IAreaCondition {
	Condition(area: BrainArea): boolean {
		if (area.GetInnerFoeCount() === 0 && 0 < area.GetFreeCoveredCells().length) {
			if (!area.IsImportant() && area.HasFreeFields() && !area.HasFarmField()) {
				return true;
			}
		}
		return false;
	}
}
