import { GlobalIa } from './../../GlobalIa';
import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
export class SpeedUpRequester implements IAreaRequestMaker {
	constructor(private _global: GlobalIa, private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		const areas = area.GetSpot().GetAroundAreas();
		const reactor = this._global.Hq.GetReactors().find((e) => area.GetSpot().Contains(e.GetCell()));

		if (
			reactor &&
			reactor.GetPower() > 1 &&
			!reactor.IsLocked() &&
			area.GetInnerFoeCount() === 0 &&
			0 === area.GetOuterFoeCount() &&
			this._global.Trucks.some((t) => areas.some((a) => a.Contains(t.GetCurrentCell())))
		) {
			return new AreaRequest(RequestType.SpeedUp, this._priority.toString(), 1, area);
		}

		return AreaRequestMaker.NoRequest(area);
	}
}
