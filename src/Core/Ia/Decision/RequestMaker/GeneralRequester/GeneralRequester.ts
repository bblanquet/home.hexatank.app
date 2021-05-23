import { IGeneralRequester } from './IGeneralRequester';
import { IGeneralListRequester } from './IGeneralListRequester';
import { AreaRequest } from '../../Utils/AreaRequest';
import { GlobalIa } from '../../GlobalIa';

export class GeneralRequester implements IGeneralListRequester {
	constructor(private _requesters: IGeneralRequester[]) {}

	public GetResquest(kingdom: GlobalIa): AreaRequest[] {
		let result = new Array<AreaRequest>();
		this._requesters.forEach((r) => {
			let request = r.GetResquest(kingdom);
			if (request.Priority !== '0') {
				result.push(request);
			}
		});
		return result;
	}
}
