import { BrainArea } from '../../Utils/BrainArea';
import { IAreaCondition } from '../IAreaCondition';
export class DefenseCondition implements IAreaCondition {
	Condition(area: BrainArea): boolean {
		return 0 < area.GetFoesCount();
	}
}
