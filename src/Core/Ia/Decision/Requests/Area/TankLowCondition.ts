import { BrainArea } from '../../Utils/BrainArea';
import { IAreaCondition } from '../IAreaCondition';

export class TankLowCondition implements IAreaCondition {
	Condition(area: BrainArea): boolean {
		return !area.HasTank() && (area.HasNature() || (area.IsImportant() && area.IsBorder()));
	}
}
