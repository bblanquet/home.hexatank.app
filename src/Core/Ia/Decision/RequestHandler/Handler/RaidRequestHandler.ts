import { RaidTroopDecisionMaker } from './../../Troop/RaidTroopDecisionMaker';
import { Kingdom } from './../../Kingdom';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequest } from '../../Utils/AreaRequest';
import { GameContext } from '../../../../Framework/GameContext';

export class RaidRequestHandler implements ISimpleRequestHandler {
	constructor(private _gameContex: GameContext, private _kingdom: Kingdom) {}

	Handle(request: AreaRequest): void {
		const hqs = this._gameContex.GetHqs().filter((h) => h !== this._kingdom.Hq);
		if (0 < hqs.length) {
			const group = new RaidTroopDecisionMaker();
			const areas = this._kingdom.GetKingdomAreas().Values().filter((a) => a.HasTroop());
			const total = 5;
			areas.some((area) => {
				group.AddTank(area.DropTroop());
				if (group.GetTankCount() >= total) {
					return true;
				}
				return false;
			});
			group.AddTarget(hqs[0]);
			group.Start();
		}
	}
	Type(): RequestType {
		return RequestType.Raid;
	}
}
