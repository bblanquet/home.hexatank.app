import { RequestPriority } from './../../Utils/RequestPriority';
import { RequestMaker } from './../RequestMaker';
import { IRequestMaker } from './../IRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class FarmRequester implements IRequestMaker {
	GetRequest(area: KingdomArea): AreaRequest {
		if (area.IsConnected() && !area.HasFarmField()) {
			return new AreaRequest(RequestType.Road, RequestPriority.High, 1, area);
		} else {
			return RequestMaker.NoRequest(area);
		}
	}
}
