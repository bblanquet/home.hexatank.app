import { AreaRequestMaker } from './../AreaRequestMaker';
import { IAreaRequestMaker } from './../IAreaRequestMaker';
import { AreaRequest } from '../../Utils/AreaRequest';
import { KingdomArea } from '../../Utils/KingdomArea';
import { ReactorAreaState } from '../../Utils/ReactorAreaState';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';
export class ReactorRequester implements IAreaRequestMaker {
	public GetRequest(area: KingdomArea): AreaRequest {
		if (!area.IsImportant() && area.IsCovered() !== ReactorAreaState.All) {
			return new AreaRequest(RequestType.Reactor, RequestPriority.High, 0, area);
		} else {
			return AreaRequestMaker.NoRequest(area);
		}
	}
}
