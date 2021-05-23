import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequestMaker } from '../AreaRequestMaker';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';

export class TruckRequest implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.GetSpot().HasDiamond() && isNullOrUndefined(area.Truck)) {
			return new AreaRequest(RequestType.Truck, this._priority.toString(), 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
