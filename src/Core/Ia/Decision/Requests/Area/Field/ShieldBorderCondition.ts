import { IaArea } from '../../../Utils/IaArea';
import { IAreaCondition } from '../../IAreaCondition';
export class ShieldBorderCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		return (
			area.GetInnerFoeCount() === 0 &&
			0 < area.GetFreeCoveredCells().length &&
			0 < area.GetOuterFoeCount() &&
			area.HasTank() &&
			area.HasFreeFields()
		);
	}
}
