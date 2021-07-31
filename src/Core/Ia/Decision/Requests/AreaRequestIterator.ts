import { IAreaRequester } from './IAreaRequester';
import { IAreaRequestIterator } from './IAreaRequestIterator';
import { RequestType } from '../Utils/RequestType';
import { BrainArea } from '../Utils/BrainArea';
import { AreaRequest } from '../Utils/AreaRequest';
import { RequestId } from './RequestId';

export class AreaRequestIterator implements IAreaRequestIterator {
	constructor(private _requesters: IAreaRequester[]) {}

	public GetRequest(area: BrainArea): AreaRequest[] {
		let requests = new Array<AreaRequest>();

		this._requesters.forEach((r) => {
			let request = r.GetRequest(area);
			if (request.Priority !== '0') {
				requests.push(request);
			}
		});

		return requests;
	}

	public static NoRequest(area: BrainArea): AreaRequest {
		return new AreaRequest(RequestType.None, '0', area);
	}

	GetIds(): RequestId[] {
		return this._requesters.map((r) => new RequestId(r.GetType(), r.GetPriority()));
	}
}
