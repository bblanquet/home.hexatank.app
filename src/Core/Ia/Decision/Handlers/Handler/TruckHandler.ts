import { MoneyOrder } from '../../../Order/Composite/MoneyOrder';
import { IBrain } from '../../IBrain';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { TruckPatrolOrder } from '../../../Order/Composite/Diamond/TruckPatrolOrder';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { Truck } from '../../../../Items/Unit/Truck';
import { HqFieldOrder } from '../../../Order/Composite/Diamond/HqFieldOrder';
import { DiamondFieldOrder } from '../../../Order/Composite/Diamond/DiamondFieldOrder';

export class TruckHandler implements IHandler {
	constructor(private _hq: Headquarter, private _kingdom: IBrain) {}

	public Handle(request: AreaRequest): void {
		var lambda: any = (obj: any, vehicle: Vehicle) => {
			if (vehicle instanceof Truck) {
				const truck = vehicle as Truck;
				if (this._kingdom.GetDiamond().IsAlive()) {
					truck.GiveOrder(
						new TruckPatrolOrder(
							truck,
							new HqFieldOrder(this._hq, truck),
							new DiamondFieldOrder(this._kingdom.GetDiamond(), truck)
						)
					);
				} else {
					truck.GiveOrder(new MoneyOrder(truck));
				}

				if (request.Area) {
					request.Area.AddTruck(truck);
				}
			}
		};
		this._hq.OnVehicleCreated.On(lambda);
		this._hq.CreateTruck();
		this._hq.OnVehicleCreated.Off(lambda);
	}
}
