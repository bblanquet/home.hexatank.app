import { BasicField } from './../../../../Items/Cell/Field/BasicField';
import { RequestPriority } from './../../Utils/RequestPriority';
import { RequestType } from './../../Utils/RequestType';
import { AreaRequestMaker } from './../AreaRequestMaker';
import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
export class ShieldAreaRequester implements IAreaRequestMaker {
	GetRequest(area: IaArea): AreaRequest {
		if (
			(area.GetRange() === 1 || area.GetRange() % 3 === 0) &&
			area.GetClosesHqField(2).some((a) => a.GetField() instanceof BasicField)
		) {
			return new AreaRequest(RequestType.Shield, RequestPriority.High, 0, area);
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
