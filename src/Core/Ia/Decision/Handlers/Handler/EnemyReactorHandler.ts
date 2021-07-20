import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { MonitoredOrder } from '../../../Order/MonitoredOrder';

export class EnemyReactorHandler implements ISimpleRequestHandler {
	Handle(request: AreaRequest): void {
		const foe = request.Area.GetFoeReactor();
		if (request.Area.HasTank() && foe) {
			const tank = request.Area.GetTroops()[0];
			tank.GiveOrder(new MonitoredOrder(foe, tank));
		}
	}
	Type(): RequestType {
		return RequestType.FoeReactor;
	}
}
