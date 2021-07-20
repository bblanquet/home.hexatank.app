import { AreaRequestMaker } from '../../AreaRequestMaker';
import { IAreaRequestMaker } from '../../IAreaRequestMaker';
import { IaArea } from '../../../Utils/IaArea';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';
export class ShieldBorderRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (
			area.GetInnerFoeCount() === 0 &&
			0 < area.GetFreeCoveredCells().length &&
			0 < area.GetOuterFoeCount() &&
			area.HasTank() &&
			area.HasFreeFields()
		) {
			return new AreaRequest(RequestType.BorderShield, this._priority.toString(), 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
