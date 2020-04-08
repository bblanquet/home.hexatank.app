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

		return this.GetEconomyRequest(area);
	}

	public GetDefenseRequest(area: KingdomArea): AreaRequest {
		const enemies = area.GetFoesCount();
		if (enemies === 0) {
			if (area.Troops.length === 0) {
				console.log(`%c [LOW REQUEST] `, 'font-weight:bold;color:green;');
				return new AreaRequest(RequestType.Tank, RequestPriority.Low, 1, area);
			}
		} else if (area.Troops.length <= enemies) {
			let requestedUnits = area.Troops.length - area.GetFoesCount();

			if (requestedUnits >= 0) {
				if (area.GetInnerFoeCount() > 0) {
					console.log(`%c [HIGH REQUEST] Enemy Count ${area.GetFoesCount()}`, 'font-weight:bold;color:red;');
					return new AreaRequest(RequestType.Tank, RequestPriority.High, requestedUnits + 1, area);
				}

				let availableSlots = area.GetFreeCellCount();

				if (requestedUnits > availableSlots) {
					requestedUnits = availableSlots;
				}

				if (area.Troops.length < area.GetOuterFoeCount()) {
					console.log(
						`%c [HIGH MEDIUM] Enemy Count ${area.GetFoesCount()}`,
						'font-weight:bold;color:orange;'
					);
					return new AreaRequest(RequestType.Tank, RequestPriority.Medium, requestedUnits, area);
				}
			}
		}
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, area);
	}

	public GetEconomyRequest(area: KingdomArea): AreaRequest {
		if (area.GetSpot().HasDiamond() && isNullOrUndefined(area.Truck)) {
			return new AreaRequest(RequestType.Truck, RequestPriority.High, 1, area);
		} else {
			return new AreaRequest(RequestType.None, RequestPriority.None, 0, area);
		}
	}
}
