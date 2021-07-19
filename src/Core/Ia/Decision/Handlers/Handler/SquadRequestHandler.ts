import { MapObserver } from './../../MapObserver';
import { Squad } from '../../Troop/Squad';
import { Brain } from '../../Brain';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequest } from '../../Utils/AreaRequest';
import { GameContext } from '../../../../Framework/Context/GameContext';

export class SquadRequestHandler implements ISimpleRequestHandler {
	constructor(private _gameContext: GameContext, private _global: Brain) {}

	Handle(request: AreaRequest): void {
		const foeHqs = this._gameContext.GetHqs().filter((h) => h !== this._global.Hq);
		if (0 < foeHqs.length) {
			const squad = new Squad(new MapObserver(this._global.AllAreas, this._global.Hq), this._global);
			const hasTarget = squad.SetMainTarget();

			if (hasTarget) {
				const areas = this._global.GetIaAreaByCell().Values().filter((a) => a.HasTroop());
				const total = 2;
				areas.some((area) => {
					squad.AddTank(area.DropTroop());
					if (total <= squad.GetTankCount()) {
						return true;
					}
					return false;
				});
				this._global.Squads.push(squad);
			}
		}
	}

	Type(): RequestType {
		return RequestType.Raid;
	}
}
