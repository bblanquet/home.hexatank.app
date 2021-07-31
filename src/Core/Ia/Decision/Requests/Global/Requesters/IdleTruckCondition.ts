import { IGlobalCondition } from '../IGlobalCondition';
import { Truck } from '../../../../../Items/Unit/Truck';
import { TruckPatrolOrder } from '../../../../Order/Composite/Diamond/TruckPatrolOrder';
import { Brain } from '../../../Brain';
import { IaArea } from '../../../Utils/IaArea';
import { GlobalRequestResult } from '../GlobalRequestResult';

export class IdleTruckCondition implements IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult {
		const trucks = brain.Hq.GetVehicles().filter((t) => t instanceof Truck);
		if (
			trucks.some(
				(t) => !t.IsBusy() || (t.GetCurrentOrder() instanceof TruckPatrolOrder && !brain.GetDiamond().IsAlive())
			)
		) {
			return new GlobalRequestResult(true, null);
		}

		return new GlobalRequestResult(false, null);
	}
}
