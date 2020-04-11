import { IRequestMaker } from './../IRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { isNullOrUndefined } from 'util';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';
import { RequestMaker } from '../RequestMaker';

export class TruckRequest implements IRequestMaker {
	GetRequest(area: KingdomArea): AreaRequest {
		if (area.GetSpot().HasDiamond() && isNullOrUndefined(area.Truck)) {
			return new AreaRequest(RequestType.Truck, RequestPriority.High, 1, area);
		} else {
			return RequestMaker.NoRequest(area);
		}
	}
}
