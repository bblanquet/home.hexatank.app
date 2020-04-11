import { FarmRequester } from './AreaRequester/FarmRequester';
import { TruckRequest } from './AreaRequester/TruckRequester';
import { RoadRequester } from './AreaRequester/RoadRequester';
import { TankRequester } from './AreaRequester/TankRequester';
import { IAreaRequestMaker } from './IAreaRequestMaker';
import { IAreaRequestListMaker } from './IAreaRequestListMaker';
import { RequestType } from '../Utils/RequestType';
import { KingdomArea } from '../Utils/KingdomArea';
import { RequestPriority } from '../Utils/RequestPriority';
import { AreaRequest } from '../Utils/AreaRequest';

export class AreaRequestMaker implements IAreaRequestListMaker {
	private _requesters: IAreaRequestMaker[];

	constructor() {
		this._requesters = [ new TruckRequest(), new RoadRequester(), new FarmRequester(), new TankRequester() ];
	}

	public GetRequest(area: KingdomArea): AreaRequest[] {
		let requests = new Array<AreaRequest>();

		this._requesters.forEach((r) => {
			let request = r.GetRequest(area);
			if (request.Priority !== RequestPriority.None) {
				requests.push(request);
			}
		});

		return requests;
	}

	public static NoRequest(area: KingdomArea): AreaRequest {
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, area);
	}
}
