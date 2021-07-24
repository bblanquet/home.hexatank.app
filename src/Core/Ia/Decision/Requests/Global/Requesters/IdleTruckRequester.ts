import { IGeneralRequester } from '../IGeneralRequester';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { Brain } from '../../../Brain';
import { RequestType } from '../../../Utils/RequestType';
import { Truck } from '../../../../../Items/Unit/Truck';
import { TruckPatrolOrder } from '../../../../Order/Composite/Diamond/TruckPatrolOrder';

export class IdleTruckRequester implements IGeneralRequester {
	constructor(private _priority: number, private _brain: Brain) {}

	GetResquest(kingdom: Brain): AreaRequest {
		const trucks = kingdom.Hq.GetVehicles().filter((t) => t instanceof Truck);
		if (
			trucks.some(
				(t) =>
					!t.HasOrder() ||
					(t.GetCurrentOrder() instanceof TruckPatrolOrder && !this._brain.GetDiamond().IsAlive())
			)
		) {
			return new AreaRequest(RequestType.TruckOrder, this._priority.toString(), 0, null);
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
