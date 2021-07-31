import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';
export class ClearAreaCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		if (area.HasNature() && area.HasFreeTank()) {
			return true;
		} else {
			return false;
		}
	}
}
