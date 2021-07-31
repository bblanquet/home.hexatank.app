import { IGlobalCondition } from '../IGlobalCondition';
import { Truck } from '../../../../../Items/Unit/Truck';
import { TruckPatrolOrder } from '../../../../Order/Composite/Diamond/TruckPatrolOrder';
import { Brain } from '../../../Brain';
import { IaArea } from '../../../Utils/IaArea';

export class IdleTruckCondition implements IGlobalCondition {
	Condition(brain: Brain): IaArea {
		const trucks = brain.Hq.GetVehicles().filter((t) => t instanceof Truck);
		if (
			trucks.some(
				(t) =>
					!t.HasOrder() || (t.GetCurrentOrder() instanceof TruckPatrolOrder && !brain.GetDiamond().IsAlive())
			)
		) {
			return brain.CellAreas.GetFromIndex(0);
		}

		return null;
	}
}
