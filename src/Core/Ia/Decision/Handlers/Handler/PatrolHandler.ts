import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';

export class PatrolHandler implements ISimpleRequestHandler {
	Handle(request: AreaRequest): void {
		const tank = request.Area.Tanks.find((t) => !t.HasOrder());
		if (tank && request.Area.GetFreeUnitCellCount()) {
			const cell = request.Area.GetRandomFreeUnitCell();
			tank.GiveOrder(new TargetMonitoredOrder(cell, tank));
		}
	}

	Type(): RequestType {
		return RequestType.Patrol;
	}
}
