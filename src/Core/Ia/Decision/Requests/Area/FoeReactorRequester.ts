import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class FoeReactorRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.GetInnerFoeCount() === 0) {
			const foe = area.GetFoeReactor();
			if (foe) {
				return new AreaRequest(RequestType.FoeReactor, this._priority.toString(), 1, area);
			}
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
