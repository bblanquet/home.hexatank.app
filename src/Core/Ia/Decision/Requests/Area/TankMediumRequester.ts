import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class TankMediumRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	public GetRequest(area: IaArea): AreaRequest {
		const foes = area.GetFoesCount();

		if (area.Troops.length <= foes) {
			let requestTroops = area.Troops.length - area.GetFoesCount();

			if (0 <= requestTroops) {
				const freeCells = area.GetFreeUnitCellCount();

				if (freeCells < requestTroops) {
					requestTroops = freeCells;
				}

				if (area.Troops.length < area.GetOuterFoeCount()) {
					return new AreaRequest(RequestType.Tank, this._priority.toString(), requestTroops, area);
				}
			}
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
