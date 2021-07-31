import { Brain } from '../../Brain';
import { BrainArea } from '../../Utils/BrainArea';
import { IAreaCondition } from '../IAreaCondition';
export class SpeedUpCondtion implements IAreaCondition {
	constructor(private _global: Brain) {}

	Condition(area: BrainArea): boolean {
		const areas = area.GetSpot().GetAroundAreas();
		const reactor = this._global.Hq.GetReactors().find((e) => area.GetSpot().Contains(e.GetCell()));

		return (
			reactor &&
			reactor.HasStock() &&
			!reactor.IsLocked() &&
			area.GetInnerFoeCount() === 0 &&
			area.GetOuterFoeCount() === 0 &&
			this._global.Trucks.some((t) => areas.some((a) => a.Contains(t.GetCurrentCell())))
		);
	}
}
