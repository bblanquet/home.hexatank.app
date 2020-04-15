import { RequestPriority } from './../../Utils/RequestPriority';
import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
export class ClearAreaRequester implements IAreaRequestMaker {
	GetRequest(area: KingdomArea): AreaRequest {
		if (area.HasNature() && area.HasTroop() && !area.IsTroopFighting()) {
			return new AreaRequest(RequestType.Clear, RequestPriority.High, 1, area);
		} else {
			return new AreaRequest(RequestType.None, RequestPriority.None, 1, area);
		}
	}
}
