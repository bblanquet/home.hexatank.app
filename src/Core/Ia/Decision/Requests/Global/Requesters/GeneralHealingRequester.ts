import { IGeneralRequester } from '../IGeneralRequester';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { Brain } from '../../../Brain';
import { RequestType } from '../../../Utils/RequestType';

export class GeneralHealingRequester implements IGeneralRequester {
	constructor(private _priority: number) {}

	GetResquest(kingdom: Brain): AreaRequest {
		const kingdomAreas = kingdom.AreaDecisions.map((a) => a);
		const candidates = kingdomAreas.filter(
			(a) => !a.IsImportant() && a.HasFreeFields() && a.HasRoadField() && a.GetInnerFoeCount() === 0
		);
		const healingArea = kingdomAreas.filter((a) => a.HasMedic());
		const total = Math.floor(kingdomAreas.length / 8);

		if (healingArea.length < total && 0 < candidates.length) {
			return new AreaRequest(RequestType.Heal, '10', 2, candidates[0]);
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
