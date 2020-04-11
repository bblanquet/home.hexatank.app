import { FarmRequester } from './Requester/FarmRequester';
import { TruckRequest } from './Requester/TruckRequester';
import { RoadRequester } from './Requester/RoadRequester';
import { TankRequester } from './Requester/TankRequester';
import { IRequestMaker } from './IRequestMaker';
import { RequestType } from '../Utils/RequestType';
import { KingdomArea } from '../Utils/KingdomArea';
import { RequestPriority } from '../Utils/RequestPriority';
import { AreaRequest } from '../Utils/AreaRequest';

export class RequestMaker implements IRequestMaker {
	private _requester: IRequestMaker[];

	constructor() {
		this._requester = [ new TankRequester(), new TruckRequest(), new RoadRequester(), new FarmRequester() ];
	}

	public GetRequest(area: KingdomArea): AreaRequest {
		let request = RequestMaker.NoRequest(area);
		this._requester.some((r) => {
			request = r.GetRequest(area);
			return request !== RequestMaker.NoRequest(area);
		});

		return request;
	}

	public static NoRequest(area: KingdomArea): AreaRequest {
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, area);
	}
}
