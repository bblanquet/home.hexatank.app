import { Kingdom } from './../../Kingdom';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { isNullOrUndefined } from 'util';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';

export class TankHighRequestHandler implements ISimpleRequestHandler {
	constructor(private _kingdom: Kingdom, private _mediumRequest: ISimpleRequestHandler) {}

	Type(): RequestType {
		return RequestType.Tank;
	}
	Priority(): RequestPriority {
		return RequestPriority.High;
	}

	Handle(request: AreaRequest): void {
		const aroundAreas = request.Area.GetSpot().GetAroundAreas();

		for (const aroundArea of aroundAreas) {
			const coordinate = aroundArea.GetCentralCell().GetCoordinate().ToString();
			if (this._kingdom.CellAreas.Exist(coordinate)) {
				const aroundArea = this._kingdom.CellAreas.Get(coordinate);
				if (!aroundArea.HasReceivedRequest) {
					aroundArea.HasReceivedRequest = true;

					while (aroundArea.Area.HasTroop()) {
						if (request.RequestCount === 0) {
							return;
						}

						const freeCell = request.Area.GetRandomFreeCell();

						if (freeCell) {
							const tank = aroundArea.Area.DropTroop();
							if (isNullOrUndefined(tank)) {
								throw 'not possible';
							}
							request.Area.AddTroop(tank, freeCell);
							request.RequestCount -= 1;
						} else {
							return;
						}
					}
				}
			}
		}

		if (request.RequestCount > 0) {
			this._mediumRequest.Handle(request);
		}
	}
}
