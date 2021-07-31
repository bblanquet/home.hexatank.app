import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';
export class DefenseCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		return 0 < area.GetFoesCount();
	}
}
