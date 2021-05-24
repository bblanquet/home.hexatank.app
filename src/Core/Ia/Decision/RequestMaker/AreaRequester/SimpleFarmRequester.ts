import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class SimpleFarmRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.GetInnerFoeCount() === 0 && area.IsCovered()) {
			if (!area.IsImportant() && area.HasFreeFields() && !area.HasFarmField()) {
				return new AreaRequest(RequestType.Farm, this._priority.toString(), 1, area);
			}
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
