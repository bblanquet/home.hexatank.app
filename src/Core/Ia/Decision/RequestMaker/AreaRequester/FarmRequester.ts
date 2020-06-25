import { RequestPriority } from '../../Utils/RequestPriority';
import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class FarmRequester implements IAreaRequestMaker {
	GetRequest(area: KingdomArea): AreaRequest {
		if (!area.IsImportant() && area.HasFreeFields() && !area.HasFarmField() && area.HasRoadField()) {
			return new AreaRequest(RequestType.Farm, RequestPriority.High, 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
