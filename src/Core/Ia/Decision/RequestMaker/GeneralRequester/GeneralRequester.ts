import { RequestType } from '../../Utils/RequestType';
import { IGeneralRequester } from './IGeneralRequester';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Kingdom } from '../../Kingdom';
import { RequestPriority } from '../../Utils/RequestPriority';

export class GeneralRequester implements IGeneralRequester {
	GetResquest(kingdom: Kingdom): AreaRequest {
		const kingdomAreas = kingdom.AreaDecisions.map((a) => a.Area);
		const farmAreas = kingdomAreas.filter((a) => a.HasFarmField());
		if (kingdom.Trucks.length * 2 < farmAreas.length) {
			return new AreaRequest(RequestType.Truck, RequestPriority.High, 2, farmAreas[0]);
		}
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, null);
	}
}
