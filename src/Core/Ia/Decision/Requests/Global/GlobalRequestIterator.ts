import { IGlobalRequester } from './IGlobalRequester';
import { IGlobalRequestIterator } from './IGlobalRequestIterator';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Brain } from '../../Brain';
import { RequestId } from '../RequestId';

export class GlobalRequestIterator implements IGlobalRequestIterator {
	constructor(private _requesters: IGlobalRequester[]) {}

	public GetResquest(kingdom: Brain): AreaRequest[] {
		let result = new Array<AreaRequest>();
		this._requesters.forEach((r) => {
			let request = r.GetResquest(kingdom);
			if (request.Priority !== '0') {
				result.push(request);
			}
		});
		return result;
	}

	GetIds(): RequestId[] {
		return this._requesters.map((r) => new RequestId(r.GetType(), r.GetPriority()));
	}
}
