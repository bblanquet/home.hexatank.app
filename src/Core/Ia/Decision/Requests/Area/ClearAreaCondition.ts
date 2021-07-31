import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';
export class ClearAreaCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		return area.HasNature() && area.HasTank() && area.HasFreeTank();
	}
}
