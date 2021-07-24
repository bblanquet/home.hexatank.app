import { Truck } from '../../../../Items/Unit/Truck';
import { DiamondFieldOrder } from '../../../Order/Composite/Diamond/DiamondFieldOrder';
import { HqFieldOrder } from '../../../Order/Composite/Diamond/HqFieldOrder';
import { TruckPatrolOrder } from '../../../Order/Composite/Diamond/TruckPatrolOrder';
import { MoneyOrder } from '../../../Order/Composite/MoneyOrder';
import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';

export class IdleTruckHandler implements ISimpleRequestHandler {
	constructor(private _brain: Brain) {}

	Handle(request: AreaRequest): void {
		const trucks = this._brain.Hq.GetVehicles().filter((t) => t instanceof Truck);
		const idleTrucks = trucks.filter((t) => !t.HasOrder()) as Truck[];
		if (0 < idleTrucks.length) {
			idleTrucks.forEach((truck) => {
				if (this._brain.GetDiamond().IsAlive()) {
					truck.GiveOrder(
						new TruckPatrolOrder(
							truck,
							new HqFieldOrder(this._brain.Hq, truck),
							new DiamondFieldOrder(this._brain.GetDiamond(), truck)
						)
					);
				} else {
					truck.GiveOrder(new MoneyOrder(truck));
				}
			});
		}
	}
	Type(): RequestType {
		return RequestType.TruckOrder;
	}
}
