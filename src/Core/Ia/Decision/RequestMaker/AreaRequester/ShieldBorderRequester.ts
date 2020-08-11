import { AreaRequestMaker } from './../AreaRequestMaker';
import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';
export class ShieldBorderRequester implements IAreaRequestMaker {
	GetRequest(area: KingdomArea): AreaRequest {
		if (0 < area.GetOuterFoeCount() && area.HasFreeFields()) {
			return new AreaRequest(RequestType.BorderShield, RequestPriority.High, 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
