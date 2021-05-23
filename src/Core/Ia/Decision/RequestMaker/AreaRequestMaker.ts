import { IAreaRequestMaker } from './IAreaRequestMaker';
import { IAreaRequestListMaker } from './IAreaRequestListMaker';
import { RequestType } from '../Utils/RequestType';
import { IaArea } from '../Utils/IaArea';
import { AreaRequest } from '../Utils/AreaRequest';

export class AreaRequestMaker implements IAreaRequestListMaker {
	constructor(private _requesters: IAreaRequestMaker[]) {}

	public GetRequest(area: IaArea): AreaRequest[] {
		let requests = new Array<AreaRequest>();

		this._requesters.forEach((r) => {
			let request = r.GetRequest(area);
			if (request.Priority !== '0') {
				requests.push(request);
			}
		});

		return requests;
	}

	public static NoRequest(area: IaArea): AreaRequest {
		return new AreaRequest(RequestType.None, '0', 0, area);
	}
}
