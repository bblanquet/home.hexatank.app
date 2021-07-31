import { IaArea } from '../../../Utils/IaArea';
import { IAreaCondition } from '../../IAreaCondition';
export class RoadFieldCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		return (
			!area.IsConnected() &&
			0 < area.GetAllyAreas().length &&
			!area.HasNature() &&
			0 < area.GetFreeCoveredCells().length
		);
	}
}
