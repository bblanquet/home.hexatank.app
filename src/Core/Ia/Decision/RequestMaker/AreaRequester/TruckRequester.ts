import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { isNullOrUndefined } from 'util';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';
import { AreaRequestMaker } from '../AreaRequestMaker';

export class TruckRequest implements IAreaRequestMaker {
	GetRequest(area: KingdomArea): AreaRequest {
		if (area.GetSpot().HasDiamond() && isNullOrUndefined(area.Truck)) {
			return new AreaRequest(RequestType.Truck, RequestPriority.High, 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
