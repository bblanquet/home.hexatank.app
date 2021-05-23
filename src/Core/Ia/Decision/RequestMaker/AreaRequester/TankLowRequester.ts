import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class TankLowRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	public GetRequest(area: IaArea): AreaRequest {
		if (!area.HasTroop()) {
			return new AreaRequest(RequestType.Tank, this._priority.toString(), 1, area);
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
