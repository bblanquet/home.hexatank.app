import { Brain } from '../../Brain';
import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
export class PowerUpRequester implements IAreaRequestMaker {
	constructor(private _global: Brain, private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		const areas = area.GetSpot().GetAroundAreas();
		const reactor = this._global.Hq.GetReactors().find((e) => area.GetSpot().Contains(e.GetCell()));
		const hasTank = this._global.Tanks.some((t) => areas.some((a) => a.Contains(t.GetCurrentCell())));

		if (0 < area.GetFoesCount() && hasTank && reactor && !reactor.IsLocked()) {
			return new AreaRequest(RequestType.PowerUp, this._priority.toString(), 1, area);
		}

		return AreaRequestMaker.NoRequest(area);
	}
}
