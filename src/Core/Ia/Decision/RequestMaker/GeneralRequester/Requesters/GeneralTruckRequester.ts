import { IGeneralRequester } from '../IGeneralRequester';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { GlobalIa } from '../../../GlobalIa';
import { RequestType } from '../../../Utils/RequestType';
import { RequestPriority } from '../../../Utils/RequestPriority';

export class GeneralTruckRequester implements IGeneralRequester {
	GetResquest(kingdom: GlobalIa): AreaRequest {
		const kingdomAreas = kingdom.AreaDecisions.map((a) => a.Area);
		const farmAreas = kingdomAreas.filter((a) => a.HasFarmField());
		if (0 < farmAreas.length && kingdom.Trucks.length * 2 <= farmAreas.length) {
			return new AreaRequest(RequestType.Truck, RequestPriority.High, 2, farmAreas[0]);
		}
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, null);
	}
}
