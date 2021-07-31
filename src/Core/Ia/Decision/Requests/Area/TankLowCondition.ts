import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';

export class TankLowCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		return !area.HasTank() && (area.HasNature() || (area.IsImportant() && area.IsBorder()));
	}
}
