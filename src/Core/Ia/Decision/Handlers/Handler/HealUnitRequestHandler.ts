import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { Brain } from '../../Brain';
import { MonitoredOrder } from '../../../Order/MonitoredOrder';

export class HealUnitRequestHandler implements ISimpleRequestHandler {
	constructor(private _kingdom: Brain) {}

	Handle(request: AreaRequest): void {
		const healingAreas = this._kingdom.GetIaAreaByCell().Values().filter((a) => a.HasMedic());
		const damagedTroops = request.Area.GetTroops().filter((t) => t.HasDamage());
		let currentArea = healingAreas.pop();
		damagedTroops.forEach((t) => {
			let destination = currentArea.GetRandomFreeUnitCell();
			while (!destination) {
				if (healingAreas.length === 0) {
					return;
				}
				currentArea = healingAreas.pop();
				destination = currentArea.GetRandomFreeUnitCell();
			}
			request.Area.DropSpecific(t);
			currentArea.Add(t);
			t.GiveOrder(new MonitoredOrder(destination, t));
		});
	}
	Type(): RequestType {
		return RequestType.HealUnit;
	}
}
