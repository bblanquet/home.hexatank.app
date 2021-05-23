import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class EnemyReactorHandler implements ISimpleRequestHandler {
	Handle(request: AreaRequest): void {
		const foe = request.Area.GetFoeReactor();
		if (request.Area.HasTroop() && foe) {
			const tank = request.Area.GetTroops()[0];
			tank.SetTarget(foe);
		}
	}
	Type(): RequestType {
		return RequestType.FoeReactor;
	}
}
