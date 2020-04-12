import { RequestPriority } from './../../Utils/RequestPriority';
import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { Kingdom } from '../../Kingdom';
export class HealUnitRequester implements IAreaRequestMaker {
	constructor(private _kingdom: Kingdom) {}

	GetRequest(area: KingdomArea): AreaRequest {
		const hasHealing = this._kingdom.GetKingdomAreas().Values().some((a) => a.HasHealing());
		if (
			hasHealing &&
			area.GetFoesCount() === 0 &&
			!area.HasHealing() &&
			area.GetTroops().some((t) => t.Tank.HasDamage)
		) {
			return new AreaRequest(RequestType.HealUnit, RequestPriority.None, 0, area);
		} else {
			return new AreaRequest(RequestType.None, RequestPriority.None, 0, area);
		}
	}
}
