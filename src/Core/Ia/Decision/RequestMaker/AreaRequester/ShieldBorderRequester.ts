import { AreaRequestMaker } from './../AreaRequestMaker';
import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';
export class ShieldBorderRequester implements IAreaRequestMaker {
	GetRequest(area: IaArea): AreaRequest {
		if (area.GetInnerFoeCount() === 0 && 0 < area.GetOuterFoeCount() && area.HasTroop() && area.HasFreeFields()) {
			return new AreaRequest(RequestType.BorderShield, RequestPriority.High, 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
