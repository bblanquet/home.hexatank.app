import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
export class ClearAreaRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.HasNature() && area.HasTroop() && !area.IsTroopFighting()) {
			return new AreaRequest(RequestType.Clear, this._priority.toString(), 1, area);
		} else {
			return new AreaRequest(RequestType.None, '0', 1, area);
		}
	}
}
