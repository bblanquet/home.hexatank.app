import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { RequestType } from '../../../Utils/RequestType';
import { AreaRequestMaker } from '../../AreaRequestMaker';
import { IAreaRequestMaker } from '../../IAreaRequestMaker';
import { IaArea } from '../../../Utils/IaArea';
import { AreaRequest } from '../../../Utils/AreaRequest';
export class ShieldFieldAreaRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.GetInnerFoeCount() === 0 && 0 < area.GetFreeCoveredCells().length) {
			if (
				(area.GetRange() === 1 || area.GetRange() % 3 === 0) &&
				area.GetClosesHqField(2).some((a) => a.GetField() instanceof BasicField)
			) {
				return new AreaRequest(RequestType.Shield, this._priority.toString(), 0, area);
			}
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
