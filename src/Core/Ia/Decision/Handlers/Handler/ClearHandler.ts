import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';

export class ClearHandler implements IHandler {
	Handle(request: AreaRequest): void {
		if (request.Area.HasNature() && request.Area.HasFreeTank()) {
			const tank = request.Area.Tanks[0];
			tank.GiveOrder(new TargetMonitoredOrder(request.Area.GetNatures()[0], tank));
		}
	}
}
