import { Brain } from '../../Brain';
import { IaArea } from '../../Utils/IaArea';
import { IAreaCondition } from '../IAreaCondition';
export class SpeedUpCondtion implements IAreaCondition {
	constructor(private _global: Brain) {}

	Condition(area: IaArea): boolean {
		const areas = area.GetSpot().GetAroundAreas();
		const reactor = this._global.Hq.GetReactors().find((e) => area.GetSpot().Contains(e.GetCell()));

		return (
			reactor &&
			reactor.GetPower() > 1 &&
			!reactor.IsLocked() &&
			area.GetInnerFoeCount() === 0 &&
			area.GetOuterFoeCount() === 0 &&
			this._global.Trucks.some((t) => areas.some((a) => a.Contains(t.GetCurrentCell())))
		);
	}
}
