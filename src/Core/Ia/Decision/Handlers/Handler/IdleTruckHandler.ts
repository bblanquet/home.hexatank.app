import { Truck } from '../../../../Items/Unit/Truck';
import { DiamondFieldOrder } from '../../../Order/Composite/Diamond/DiamondFieldOrder';
import { HqFieldOrder } from '../../../Order/Composite/Diamond/HqFieldOrder';
import { TruckPatrolOrder } from '../../../Order/Composite/Diamond/TruckPatrolOrder';
import { MoneyOrder } from '../../../Order/Composite/MoneyOrder';
import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';
import { IHandler } from '../IHandler';

export class IdleTruckHandler implements IHandler {
	constructor(private _brain: Brain) {}

	Handle(request: AreaRequest): void {
		this._brain.Hq
			.GetVehicles()
			.filter((t) => t instanceof Truck)
			.map((t) => t as Truck)
			.filter((t) => this.IsIdle(t as Truck))
			.forEach((truck) => {
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

	private IsIdle(t: Truck): boolean {
		return (
			!t.HasOrder() || (t.GetCurrentOrder() instanceof TruckPatrolOrder && !this._brain.GetDiamond().IsAlive())
		);
	}
}
