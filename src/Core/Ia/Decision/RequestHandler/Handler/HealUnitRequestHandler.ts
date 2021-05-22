import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { GlobalIa } from '../../GlobalIa';

export class HealUnitRequestHandler implements ISimpleRequestHandler {
	constructor(private _kingdom: GlobalIa) {}

	Handle(request: AreaRequest): void {
		const healingAreas = this._kingdom.GetKingdomAreas().Values().filter((a) => a.HasMedic());
		const damagedTroops = request.Area.GetTroops().filter((t) => t.Tank.HasDamage());
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
			request.Area.DropSpecificTroop(t);
			currentArea.AddTroop(t.Tank, destination);
		});
	}
	Type(): RequestType {
		return RequestType.HealUnit;
	}
}
