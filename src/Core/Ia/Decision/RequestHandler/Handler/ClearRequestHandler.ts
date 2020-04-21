import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class ClearRequestHandler implements ISimpleRequestHandler {
	Handle(request: AreaRequest): void {
		if (request.Area.HasTroop() && request.Area.HasNature() && !request.Area.IsTroopFighting()) {
			request.Area.GetTroops()[0].SetTarget(request.Area.GetNatures()[0]);
		}
	}
	Type(): RequestType {
		return RequestType.Clear;
	}
}
