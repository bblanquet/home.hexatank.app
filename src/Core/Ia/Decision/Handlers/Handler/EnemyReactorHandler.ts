import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';

export class EnemyReactorHandler implements IHandler {
	Handle(request: AreaRequest): void {
		const foe = request.Area.GetFoeReactor();
		if (request.Area.HasTank() && foe) {
			const tank = request.Area.Tanks[0];
			tank.GiveOrder(new TargetMonitoredOrder(foe, tank));
		}
	}
}
