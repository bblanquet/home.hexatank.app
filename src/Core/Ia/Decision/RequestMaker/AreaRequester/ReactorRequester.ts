import { AreaRequestMaker } from './../AreaRequestMaker';
import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { AreaRequest } from '../../Utils/AreaRequest';
import { IaArea } from '../../Utils/IaArea';
import { ReactorAreaState } from '../../Utils/ReactorAreaState';
import { RequestType } from '../../Utils/RequestType';
export class ReactorRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	public GetRequest(area: IaArea): AreaRequest {
		if (area.GetInnerFoeCount() === 0) {
			if (!area.IsImportant() && area.IsCovered() !== ReactorAreaState.All && area.ContainsTroop()) {
				return new AreaRequest(RequestType.Reactor, this._priority.toString(), 0, area);
			}
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
