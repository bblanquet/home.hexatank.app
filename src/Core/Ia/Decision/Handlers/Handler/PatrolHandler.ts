import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';
import { MedicField } from '../../../../Items/Cell/Field/Bonus/MedicField';

export class PatrolHandler implements IHandler {
	Handle(request: AreaRequest): void {
		const tanks = request.Area.Tanks.filter((t) => !t.IsBusy());
		tanks.forEach((t) => {
			if (t.HasDamage()) {
				const cells = request.Area.GetCells([ MedicField.name ]);
				if (!cells.includes(t.GetCurrentCell())) {
					const medicCell = cells.find((c) => !c.IsBlocked());
					if (medicCell) {
						t.GiveOrder(new TargetMonitoredOrder(medicCell, t));
					}
				}
			} else {
				const cell = request.Area.GetRandomFreeUnitCell();
				if (cell) {
					t.GiveOrder(new TargetMonitoredOrder(cell, t));
				}
			}
		});
	}
}
