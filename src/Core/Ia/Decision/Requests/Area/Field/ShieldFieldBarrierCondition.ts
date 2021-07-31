import { IaArea } from '../../../Utils/IaArea';
import { IAreaCondition } from '../../IAreaCondition';
export class ShieldFieldBarrierCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		const freeCells = area.GetFreeCoveredCells();
		return (
			area.GetInnerFoeCount() === 0 &&
			0 < freeCells.length &&
			(area.GetRange() === 1 || area.GetRange() % 3 === 0) &&
			area.GetClosesHqField(2).some((a) => freeCells.some((e) => a === e))
		);
	}
}
