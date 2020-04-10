import { isNullOrUndefined } from 'util';
import { IRequestMaker } from './IRequestMaker';
import { RequestType } from '../Utils/RequestType';
import { KingdomArea } from '../Utils/KingdomArea';
import { RequestPriority } from '../Utils/RequestPriority';
import { AreaRequest } from '../Utils/AreaRequest';

export class RequestMaker implements IRequestMaker {
	public GetRequest(area: KingdomArea): AreaRequest {
		let request = this.GetDefenseRequest(area);

		if (request.RequestType !== RequestType.None) {
			return request;
		}

		request = this.GetTruckRequest(area);

		if (request.RequestType !== RequestType.None) {
			return request;
		}

		return this.GetRoadRequest(area);
	}

	public GetDefenseRequest(area: KingdomArea): AreaRequest {
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
		return this.NoRequest(area);
	}

	public GetTruckRequest(area: KingdomArea): AreaRequest {
		if (area.GetSpot().HasDiamond() && isNullOrUndefined(area.Truck)) {
			return new AreaRequest(RequestType.Truck, RequestPriority.High, 1, area);
		} else {
			return this.NoRequest(area);
		}
	}

	public GetRoadRequest(area: KingdomArea): AreaRequest {
		if (!area.IsConnected() && 0 < area.GetAllyAreas().length) {
			return new AreaRequest(RequestType.Road, RequestPriority.High, 1, area);
		} else {
			return this.NoRequest(area);
		}
	}

	private NoRequest(area: KingdomArea): AreaRequest {
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, area);
	}
}
