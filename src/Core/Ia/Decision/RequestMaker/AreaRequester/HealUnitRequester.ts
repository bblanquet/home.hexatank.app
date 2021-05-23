import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { GlobalIa } from '../../GlobalIa';
export class HealUnitRequester implements IAreaRequestMaker {
	constructor(private _kingdom: GlobalIa, private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		const hasHealing = this._kingdom.GetIaAreaByCell().Values().some((a) => a.HasMedic());
		if (
			hasHealing &&
			area.GetFoesCount() === 0 &&
			!area.HasMedic() &&
			area.GetTroops().some((t) => t.Tank.HasDamage())
		) {
			return new AreaRequest(RequestType.HealUnit, this._priority.toString(), 0, area);
		} else {
			return new AreaRequest(RequestType.None, '0', 0, area);
		}
	}
}
