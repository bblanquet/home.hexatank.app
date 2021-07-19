import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { Brain } from '../../Brain';
export class HealUnitRequester implements IAreaRequestMaker {
	constructor(private _kingdom: Brain, private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.GetInnerFoeCount() === 0) {
			const hasHealing = this._kingdom.GetIaAreaByCell().Values().some((a) => a.HasMedic());
			if (
				hasHealing &&
				area.GetFoesCount() === 0 &&
				!area.HasMedic() &&
				area.GetTroops().some((t) => t.Tank.HasDamage())
			) {
				return new AreaRequest(RequestType.HealUnit, this._priority.toString(), 0, area);
			}
		}
		return new AreaRequest(RequestType.None, '0', 0, area);
	}
}
