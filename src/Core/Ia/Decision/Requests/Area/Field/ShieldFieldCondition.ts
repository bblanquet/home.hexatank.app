import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { IaArea } from '../../../Utils/IaArea';
import { IAreaCondition } from '../../IAreaCondition';
export class ShieldFieldCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		if (area.GetInnerFoeCount() === 0 && 0 < area.GetFreeCoveredCells().length) {
			if (
				(area.GetRange() === 1 || area.GetRange() % 3 === 0) &&
				area.GetClosesHqField(2).some((a) => a.GetField() instanceof BasicField)
			) {
				return true;
			}
		}
		return false;
	}
}
