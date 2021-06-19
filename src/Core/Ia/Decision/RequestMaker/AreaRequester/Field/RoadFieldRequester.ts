import { IAreaRequestMaker } from '../../IAreaRequestMaker';
import { IaArea } from '../../../Utils/IaArea';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';
import { AreaRequestMaker } from '../../AreaRequestMaker';

export class RoadFieldRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (
			!area.IsConnected() &&
			0 < area.GetAllyAreas().length &&
			!area.HasNature() &&
			0 < area.GetFreeCoveredCells().length
		) {
			return new AreaRequest(RequestType.Road, this._priority.toString(), 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}