import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { MonitoredOrder } from '../../../Order/MonitoredOrder';

export class EnemyReactorHandler implements IHandler {
	Handle(request: AreaRequest): void {
		const foe = request.Area.GetFoeReactor();
		if (request.Area.HasTank() && foe) {
			const tank = request.Area.GetTroops()[0];
			tank.GiveOrder(new MonitoredOrder(foe, tank));
		}
	}
}
