import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';
export class FoeReactorCondition implements IAreaCondition {
	Condition(area: IaArea): boolean {
		if (area.GetInnerFoeCount() === 0) {
			const foe = area.GetFoeReactor();
			if (foe) {
				return true;
			}
		}
		return false;
	}
}
