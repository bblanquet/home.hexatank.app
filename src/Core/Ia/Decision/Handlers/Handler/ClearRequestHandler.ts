import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';

export class ClearRequestHandler implements ISimpleRequestHandler {
	Handle(request: AreaRequest): void {
		if (request.Area.HasTank() && request.Area.HasNature() && !request.Area.IsTankEngaged()) {
			const tank = request.Area.GetTroops()[0];
			tank.GiveOrder(new TargetMonitoredOrder(request.Area.GetNatures()[0], tank));
		}
	}
	Type(): RequestType {
		return RequestType.Clear;
	}
}
