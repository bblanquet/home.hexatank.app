import { BrainArea } from '../../Utils/BrainArea';
import { IAreaCondition } from '../IAreaCondition';
export class ClearAreaCondition implements IAreaCondition {
	Condition(area: BrainArea): boolean {
		if (area.HasNature() && area.HasFreeTank()) {
			return true;
		} else {
			return false;
		}
	}
}
