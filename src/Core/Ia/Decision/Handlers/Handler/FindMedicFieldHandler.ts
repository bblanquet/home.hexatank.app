import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Brain } from '../../Brain';
import { MonitoredOrder } from '../../../Order/MonitoredOrder';

export class FindMedicFieldHandler implements IHandler {
	constructor(private _brain: Brain) {}

	Handle(request: AreaRequest): void {
		const medicAreas = this._brain.BrainAreas.filter((a) => a.HasMedic());
		const damagedTanks = request.Area.Tanks.filter((t) => t.HasDamage());
		let currentArea = medicAreas.pop();
		damagedTanks.forEach((t) => {
			let destination = currentArea.GetRandomFreeUnitCell();
			while (!destination) {
				if (medicAreas.length === 0) {
					return;
				}
				currentArea = medicAreas.pop();
				destination = currentArea.GetRandomFreeUnitCell();
			}
			request.Area.DropSpecific(t);
			currentArea.Add(t);
			t.GiveOrder(new MonitoredOrder(destination, t));
		});
	}
}
