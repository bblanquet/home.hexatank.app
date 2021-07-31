import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';

export class PatrolHandler implements IHandler {
	Handle(request: AreaRequest): void {
		const tank = request.Area.Tanks.find((t) => !t.HasOrder());
		if (tank && request.Area.GetFreeUnitCellCount()) {
			const cell = request.Area.GetRandomFreeUnitCell();
			tank.GiveOrder(new TargetMonitoredOrder(cell, tank));
		}
	}
}
