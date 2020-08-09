import { TimeTimer } from '../../../../../Utils/Timer/TimeTimer';
import { IGeneralRequester } from '../IGeneralRequester';
import { Kingdom } from '../../../Kingdom';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';
import { RequestPriority } from '../../../Utils/RequestPriority';

export class GeneralSquadRequest implements IGeneralRequester {
	private _raidTimer: TimeTimer;

	constructor() {
		this._raidTimer = new TimeTimer(8000);
	}

	GetResquest(kingdom: Kingdom): AreaRequest {
		const kingdomAreas = kingdom.AreaDecisions.map((a) => a.Area);
		const farmAreas = kingdomAreas.filter((a) => a.HasFarmField());
		if (this._raidTimer.IsElapsed()) {
			if (kingdom.GetKingdomAreas().Values().filter((a) => a.HasTroop()).length >= 4) {
				return new AreaRequest(RequestType.Raid, RequestPriority.High, 2, farmAreas[0]);
			}
		}
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, null);
	}
}
