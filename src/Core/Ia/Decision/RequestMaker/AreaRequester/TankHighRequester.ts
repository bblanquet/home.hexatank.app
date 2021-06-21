import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class TankRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	public GetRequest(area: IaArea): AreaRequest {
		const foes = area.GetFoesCount();
		if (area.Troops.length <= foes) {
			let requestTroops = area.Troops.length - area.GetFoesCount();
			if (0 <= requestTroops) {
				if (0 < area.GetInnerFoeCount()) {
					// console.log('tank foes');
					return new AreaRequest(RequestType.Tank, this._priority.toString(), requestTroops + 1, area);
				}
			}
		} else if (area.Troops.length === 0 && area.HasNature()) {
			// console.log('tank clear');
			return new AreaRequest(RequestType.Tank, this._priority.toString(), 1, area);
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
