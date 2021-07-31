import { MapObserver } from './../../MapObserver';
import { Squad } from '../../Troop/Squad';
import { Brain } from '../../Brain';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { IHeadquarter } from '../../../../Items/Cell/Field/Hq/IHeadquarter';

export class SquadRequestHandler implements IHandler {
	constructor(private _hqs: IHeadquarter[], private _global: Brain) {}

	Handle(request: AreaRequest): void {
		const foeHqs = this._hqs.filter((h) => h !== this._global.Hq);
		if (0 < foeHqs.length) {
			const squad = new Squad(new MapObserver(this._global.AllAreas, this._global.Hq), this._global);
			const hasTarget = squad.SetMainTarget();

			if (hasTarget) {
				const areas = this._global.GetIaAreaByCell().Values().filter((a) => a.HasTank());
				const total = 2;
				areas.some((area) => {
					squad.AddTank(area.Drop());
					if (total <= squad.GetTankCount()) {
						return true;
					}
					return false;
				});
				this._global.Squads.push(squad);
			}
		}
	}
}
