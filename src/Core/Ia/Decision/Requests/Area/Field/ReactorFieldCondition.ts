import { IaArea } from '../../../Utils/IaArea';
import { ReactorAreaState } from '../../../Utils/ReactorAreaState';
import { IAreaCondition } from '../../IAreaCondition';
export class ReactorFieldCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		if (area.GetInnerFoeCount() === 0) {
			if (!area.IsImportant() && area.IsCovered() !== ReactorAreaState.All && area.ContainsTroop()) {
				return true;
			}
		}
		return false;
	}
}
