import { IGeneralRequester } from '../IGeneralRequester';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { Brain } from '../../../Brain';
import { RequestType } from '../../../Utils/RequestType';

export class GeneralTruckRequester implements IGeneralRequester {
	constructor(private _priority: number) {}

	GetResquest(kingdom: Brain): AreaRequest {
		const kingdomAreas = kingdom.AreaDecisions.map((a) => a);
		const farmAreas = kingdomAreas.filter((a) => a.HasFarmField());
		if (0 < farmAreas.length && kingdom.Trucks.length * 2 <= farmAreas.length) {
			return new AreaRequest(RequestType.Truck, this._priority.toString(), 2, farmAreas[0]);
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
