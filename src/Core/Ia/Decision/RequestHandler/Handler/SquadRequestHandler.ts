import { MapObserver } from './../../MapObserver';
import { Squad } from '../../Troop/Squad';
import { GlobalIa } from '../../GlobalIa';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequest } from '../../Utils/AreaRequest';
import { GameContext } from '../../../../Framework/GameContext';
import { SquadRoad } from '../../Troop/SquadRoad';

export class SquadRequestHandler implements ISimpleRequestHandler {
	constructor(private _gameContex: GameContext, private _kingdom: GlobalIa) {}

	Handle(request: AreaRequest): void {
		const foes = this._gameContex.GetHqs().filter((h) => h !== this._kingdom.Hq);
		if (0 < foes.length) {
			const squad = new Squad(
				new SquadRoad(this._kingdom.Hq),
				new MapObserver(this._kingdom.AllAreas, this._kingdom.Hq),
				this._kingdom
			);
			const hasTarget = squad.SetMainTarget();

			if (hasTarget) {
				const areas = this._kingdom.GetIaAreaByCell().Values().filter((a) => a.HasTroop());
				const total = 2;
				areas.some((area) => {
					squad.AddTank(area.DropTroop());
					if (total <= squad.GetTankCount()) {
						return true;
					}
					return false;
				});
				this._kingdom.Squads.push(squad);
			}
		}
	}

	Type(): RequestType {
		return RequestType.Raid;
	}
}
