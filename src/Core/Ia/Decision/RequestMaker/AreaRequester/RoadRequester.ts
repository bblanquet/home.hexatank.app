import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';
import { AreaRequestMaker } from '../AreaRequestMaker';

export class RoadRequester implements IAreaRequestMaker {
	GetRequest(area: IaArea): AreaRequest {
		if (!area.IsConnected() && 0 < area.GetAllyAreas().length && !area.HasNature()) {
			return new AreaRequest(RequestType.Road, RequestPriority.Medium, 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
