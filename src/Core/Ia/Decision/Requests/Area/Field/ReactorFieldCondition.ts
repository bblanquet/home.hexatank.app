import { BrainArea } from '../../../Utils/BrainArea';
import { ReactorAreaState } from '../../../Utils/ReactorAreaState';
import { IAreaCondition } from '../../IAreaCondition';
export class ReactorFieldCondition implements IAreaCondition {
	Condition(area: BrainArea): boolean {
		if (area.GetInnerFoeCount() === 0) {
			if (!area.IsImportant() && area.IsCovered() !== ReactorAreaState.All && area.ContainsTank()) {
				return true;
			}
		}
		return false;
	}
}
