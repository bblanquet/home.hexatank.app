import { AreaRequest } from '../../../Utils/AreaRequest';
import { IaArea } from '../../../Utils/IaArea';
import { RequestType } from '../../../Utils/RequestType';
import { AreaRequestMaker } from '../../AreaRequestMaker';
import { IAreaRequestMaker } from '../../IAreaRequestMaker';

export class FarmFieldRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.GetInnerFoeCount() === 0) {
			if (
				!area.IsImportant() &&
				0 < area.GetFreeCoveredCells().length &&
				!area.HasFarmField() &&
				area.HasRoadField()
			) {
				return new AreaRequest(RequestType.Farm, this._priority.toString(), 1, area);
			}
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
