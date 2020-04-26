import { MoneyOrder } from './../../../Order/MoneyOrder';
import { IKingdomDecisionMaker } from './../../IKingdomDecisionMaker';
import { Headquarter } from './../../../../Items/Cell/Field/Headquarter';
import { TruckPatrolOrder } from './../../../Order/TruckPatrolOrder';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { Truck } from '../../../../Items/Unit/Truck';
import { HqFieldOrder } from '../../../Order/HqFieldOrder';
import { DiamondFieldOrder } from '../../../Order/DiamondFieldOrder';
import { RequestType } from '../../Utils/RequestType';

export class TruckRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter, private _kingdom: IKingdomDecisionMaker) {}

	Type(): RequestType {
		return RequestType.Truck;
	}

	public Handle(request: AreaRequest): void {
		console.log(`%c [TRUCK] `, 'font-weight:bold;color:blue;');
		var lambda: any = (obj: any, vehicle: Vehicle) => {
			if (vehicle instanceof Truck) {
				const truck = vehicle as Truck;
				if (this._kingdom.GetDiamond().IsAlive()) {
					truck.SetOrder(
						new TruckPatrolOrder(
							truck,
							new HqFieldOrder(this._hq, truck),
							new DiamondFieldOrder(this._kingdom.GetDiamond(), truck)
						)
					);
				} else {
					truck.SetOrder(new MoneyOrder(truck));
				}

				request.Area.Truck = truck;
			}
		};
		this._hq.OnVehiculeCreated.On(lambda);
		this._hq.CreateTruck();
		this._hq.OnVehiculeCreated.Off(lambda);
	}
}
