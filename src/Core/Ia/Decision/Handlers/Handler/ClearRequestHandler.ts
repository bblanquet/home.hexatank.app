import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';

export class ClearRequestHandler implements IHandler {
	Handle(request: AreaRequest): void {
		if (request.Area.HasTank() && request.Area.HasNature() && request.Area.HasFreeTank()) {
			const tank = request.Area.GetTroops()[0];
			tank.GiveOrder(new TargetMonitoredOrder(request.Area.GetNatures()[0], tank));
		}
	}
}
