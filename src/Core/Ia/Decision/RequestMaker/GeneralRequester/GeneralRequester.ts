import { GeneralEnergyRequester } from './Requesters/GeneralEnergyRequester';
import { GeneralTruckRequester } from './Requesters/GeneralTruckRequester';
import { GeneralHealingRequester } from './Requesters/GeneralHealingRequester';
import { IGeneralRequester } from './IGeneralRequester';
import { IGeneralListRequester } from './IGeneralListRequester';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Kingdom } from '../../Kingdom';
import { RequestPriority } from '../../Utils/RequestPriority';

export class GeneralRequester implements IGeneralListRequester {
	_requesters: IGeneralRequester[];
	constructor() {
		this._requesters = [ new GeneralTruckRequester(), new GeneralHealingRequester(), new GeneralEnergyRequester() ];
	}

	public GetResquest(kingdom: Kingdom): AreaRequest[] {
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
