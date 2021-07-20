import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
export class DefenseRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (0 < area.GetFoesCount()) {
			return new AreaRequest(RequestType.Defense, this._priority.toString(), 1, area);
		}

		return AreaRequestMaker.NoRequest(area);
	}
}
