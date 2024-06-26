import { BrainArea } from '../../../Utils/BrainArea';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { IAreaCondition } from '../../IAreaCondition';

export class ReactorShieldCondition implements IAreaCondition {
	Condition(area: BrainArea): boolean {
		if (0 < area.GetFreeCoveredCells().length) {
			const reactor = area.GetReactor();
			if (reactor) {
				const cells = reactor.GetFilteredNearby((c) => c && c.GetField() instanceof BasicField);
				if (0 < cells.length) {
					return true;
				}
			}
		}
		return false;
	}
}
