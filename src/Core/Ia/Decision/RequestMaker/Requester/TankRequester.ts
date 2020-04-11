import { RequestMaker } from './../RequestMaker';
import { IRequestMaker } from './../IRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';

export class TankRequester implements IRequestMaker {
	public GetRequest(area: KingdomArea): AreaRequest {
		const enemies = area.GetFoesCount();
		if (enemies === 0) {
			if (area.Troops.length === 0) {
				return new AreaRequest(RequestType.Tank, RequestPriority.Low, 1, area);
			}
		} else if (area.Troops.length <= enemies) {
			let requestedUnits = area.Troops.length - area.GetFoesCount();

			if (0 <= requestedUnits) {
				if (0 < area.GetInnerFoeCount()) {
					return new AreaRequest(RequestType.Tank, RequestPriority.High, requestedUnits + 1, area);
				}

				let availableSlots = area.GetFreeCellCount();

				if (requestedUnits > availableSlots) {
					requestedUnits = availableSlots;
				}

				if (area.Troops.length < area.GetOuterFoeCount()) {
					return new AreaRequest(RequestType.Tank, RequestPriority.Medium, requestedUnits, area);
				}
			}
		}
		return RequestMaker.NoRequest(area);
	}
}
