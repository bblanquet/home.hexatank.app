import { IGeneralRequester } from './IGeneralRequester';
import { IGeneralListRequester } from './IGeneralListRequester';
import { AreaRequest } from '../../Utils/AreaRequest';
import { GlobalIa } from '../../GlobalIa';
import { RequestPriority } from '../../Utils/RequestPriority';

export class GeneralRequester implements IGeneralListRequester {
	constructor(private _requesters: IGeneralRequester[]) {}

	public GetResquest(kingdom: GlobalIa): AreaRequest[] {
		let result = new Array<AreaRequest>();
		this._requesters.forEach((r) => {
			let request = r.GetResquest(kingdom);
			if (request.Priority !== RequestPriority.None) {
				result.push(request);
			}
		});
		return result;
	}
}
