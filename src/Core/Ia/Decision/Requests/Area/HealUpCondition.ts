import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { Brain } from '../../Brain';
import { BrainArea } from '../../Utils/BrainArea';
import { IAreaCondition } from '../IAreaCondition';
export class HealUpCondition implements IAreaCondition {
	constructor(private _global: Brain) {}

	Condition(area: BrainArea): boolean {
		const areas = area.GetSpot().GetAroundAreas();
		const reactor = this._global.Hq.GetReactors().find((e) => area.GetSpot().Contains(e.GetCell()));
		const damageVehicles = ([ ...this._global.Tanks ] as Vehicle[])
			.concat([ ...this._global.Trucks ])
			.filter((v) => v.HasDamage());

		return (
			reactor &&
			reactor.HasStock() &&
			!reactor.IsLocked() &&
			area.GetInnerFoeCount() === 0 &&
			area.GetOuterFoeCount() === 0 &&
			damageVehicles.some((t) => areas.some((a) => a.Contains(t.GetCurrentCell())))
		);
	}
}
