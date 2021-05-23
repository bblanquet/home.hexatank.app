import { TimeTimer } from '../../../../../Utils/Timer/TimeTimer';
import { IGeneralRequester } from '../IGeneralRequester';
import { GlobalIa } from '../../../GlobalIa';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';

export class GeneralSquadRequest implements IGeneralRequester {
	private _raidTimer: TimeTimer;

	constructor(private _priority: number) {
		this._raidTimer = new TimeTimer(8000);
	}

	GetResquest(kingdom: GlobalIa): AreaRequest {
		const kingdomAreas = kingdom.AreaDecisions.map((a) => a.Area);
		const farmAreas = kingdomAreas.filter((a) => a.HasFarmField());
		if (this._raidTimer.IsElapsed()) {
			if (kingdom.GetIaAreaByCell().Values().filter((a) => a.HasTroop()).length >= 4) {
				return new AreaRequest(RequestType.Raid, this._priority.toString(), 2, farmAreas[0]);
			}
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
