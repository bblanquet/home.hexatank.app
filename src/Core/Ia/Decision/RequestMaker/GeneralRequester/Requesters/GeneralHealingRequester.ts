import { IGeneralRequester } from '../IGeneralRequester';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { Kingdom } from '../../../Kingdom';
import { RequestType } from '../../../Utils/RequestType';
import { RequestPriority } from '../../../Utils/RequestPriority';

export class GeneralHealingRequester implements IGeneralRequester {
	GetResquest(kingdom: Kingdom): AreaRequest {
		const kingdomAreas = kingdom.AreaDecisions.map((a) => a.Area);
		const candidates = kingdomAreas.filter((a) => !a.IsImportant() && a.HasFreeFields() && a.HasRoadField());
		const healingArea = kingdomAreas.filter((a) => a.HasMedic());
		const total = Math.floor(kingdomAreas.length / 8);

		if (healingArea.length < total && 0 < candidates.length) {
			return new AreaRequest(RequestType.Heal, RequestPriority.High, 2, candidates[0]);
		}
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, null);
	}
}
