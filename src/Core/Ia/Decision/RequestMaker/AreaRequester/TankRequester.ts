import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';

export class TankRequester implements IAreaRequestMaker {
	public GetRequest(area: KingdomArea): AreaRequest {
		const foes = area.GetFoesCount();

		if (foes === 0) {
			if (area.Troops.length === 0 && (area.IsBorder() || area.HasNature())) {
				return new AreaRequest(RequestType.Tank, RequestPriority.Low, 1, area);
			}
		} else if (area.Troops.length <= foes) {
			let requestTroops = area.Troops.length - area.GetFoesCount();

			if (0 <= requestTroops) {
				if (0 < area.GetInnerFoeCount()) {
					return new AreaRequest(RequestType.Tank, RequestPriority.High, requestTroops + 1, area);
				}

				const freeCells = area.GetFreeUnitCellCount();

				if (freeCells < requestTroops) {
					requestTroops = freeCells;
				}

				if (area.Troops.length < area.GetOuterFoeCount()) {
					return new AreaRequest(RequestType.Tank, RequestPriority.Medium, requestTroops, area);
				}
			}
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
