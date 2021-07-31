import { Brain } from '../../Brain';
import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';
export class FireUpCondition implements IAreaCondition {
	constructor(private _global: Brain) {}
	Condition(area: IaArea): boolean {
		const areas = area.GetSpot().GetAroundAreas();
		const reactor = this._global.Hq.GetReactors().find((e) => area.GetSpot().Contains(e.GetCell()));
		const hasTank = this._global.Tanks.some((t) => areas.some((a) => a.Contains(t.GetCurrentCell())));

		return 0 < area.GetFoesCount() && hasTank && reactor && !reactor.IsLocked();
	}
}
