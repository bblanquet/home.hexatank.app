import { IGeneralRequester } from './../IGeneralRequester';
import { Kingdom } from '../../../Kingdom';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';
import { RequestPriority } from '../../../Utils/RequestPriority';

export class GeneralEnergyRequester implements IGeneralRequester {
	GetResquest(kingdom: Kingdom): AreaRequest {
		const reactors = kingdom.Hq.GetReactors().filter((r) => r.GetPower() === 0 && r.HasStock() === false);
		if (0 < reactors.length) {
			const area = kingdom.GetArea(reactors[0].GetCell());
			return new AreaRequest(RequestType.Energy, RequestPriority.High, 1, area);
		}
		return new AreaRequest(RequestType.None, RequestPriority.None, 0, null);
	}
}
