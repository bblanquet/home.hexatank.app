import { AreaRequestMaker } from '../AreaRequestMaker';
import { IAreaRequestMaker } from '../IAreaRequestMaker';
import { IaArea } from '../../Utils/IaArea';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';

export class FoeReactorRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		const foe = area.GetFoeReactor();
		if (foe) {
			return new AreaRequest(RequestType.FoeReactor, this._priority.toString(), 1, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
