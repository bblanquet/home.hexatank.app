import { MapObserver } from './../../MapObserver';
import { Squad } from '../../Troop/Squad';
import { Kingdom } from '../../Kingdom';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequest } from '../../Utils/AreaRequest';
import { GameContext } from '../../../../Framework/GameContext';
import { SquadRoad } from '../../Troop/SquadRoad';

export class SquadRequestHandler implements ISimpleRequestHandler {
	constructor(private _gameContex: GameContext, private _kingdom: Kingdom) {}

	Handle(request: AreaRequest): void {
		const hqs = this._gameContex.GetHqs().filter((h) => h !== this._kingdom.Hq);
		if (0 < hqs.length) {
			const squad = new Squad(
				new SquadRoad(this._kingdom.Hq),
				new MapObserver(this._kingdom.Areas, this._kingdom.Hq),
				this._kingdom.Hq
			);
			const areas = this._kingdom.GetKingdomAreas().Values().filter((a) => a.HasTroop());
			const total = 5;
			areas.some((area) => {
				squad.AddTank(area.DropTroop());
				if (total <= squad.GetTankCount()) {
					return true;
				}
				return false;
			});
			squad.SetTarget();
			this._kingdom.Squads.push(squad);
		}
	}

	Type(): RequestType {
		return RequestType.Raid;
	}
}
