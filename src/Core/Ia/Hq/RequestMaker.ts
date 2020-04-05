import { AreaStatus } from '../Utils/AreaStatus';
import { RequestPriority } from './RequestPriority';
import { AreaRequest } from '../Utils/AreaRequest';

export class RequestMaker {
	public static GetRequest(status: AreaStatus): AreaRequest {
		const enemies = status.GetTotalEnemies();
		if (enemies === 0) {
			if (status.InnerTroops === 0) {
				console.log(`%c [LOW REQUEST] `, 'font-weight:bold;color:green;');
				return new AreaRequest(RequestPriority.Low, 1, status);
			}
		} else if (status.InnerTroops <= enemies) {
			let requestedUnits = status.InnerTroops - status.GetTotalEnemies();

			if (requestedUnits >= 0) {
				if (status.InnerFoes > 0) {
					console.log(
						`%c [HIGH REQUEST] Enemy Count ${status.GetTotalEnemies()}`,
						'font-weight:bold;color:red;'
					);
					return new AreaRequest(RequestPriority.High, requestedUnits + 1, status);
				}

				let availableSlots = status.Area.GetFreeCellCount();

				if (requestedUnits > availableSlots) {
					requestedUnits = availableSlots;
				}

				if (status.InnerTroops < status.OuterFoes) {
					console.log(
						`%c [HIGH MEDIUM] Enemy Count ${status.GetTotalEnemies()}`,
						'font-weight:bold;color:orange;'
					);
					return new AreaRequest(RequestPriority.Medium, requestedUnits, status);
				}
			}
		}

		return new AreaRequest(RequestPriority.None, 0, status);
	}
}
