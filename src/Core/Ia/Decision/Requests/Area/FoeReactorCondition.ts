import { BrainArea } from '../../Utils/BrainArea';
import { IAreaCondition } from '../IAreaCondition';
export class FoeReactorCondition implements IAreaCondition {
	Condition(area: BrainArea): boolean {
		if (area.GetInnerFoeCount() === 0) {
			const foe = area.GetFoeReactor();
			if (foe) {
				return true;
			}
		}
		return false;
	}
}
