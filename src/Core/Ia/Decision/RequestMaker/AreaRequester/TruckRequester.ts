import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequestMaker } from '../AreaRequestMaker';

export class TruckRequest implements IAreaRequestMaker {
	constructor(private _priority: number, private _threshold: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.GetSpot().HasDiamond() && area.GetTrucks().length < this._threshold) {
			return new AreaRequest(RequestType.Truck, this._priority.toString(), 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
