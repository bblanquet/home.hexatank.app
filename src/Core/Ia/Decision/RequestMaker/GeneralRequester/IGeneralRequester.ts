import { GlobalIa } from '../../GlobalIa';
import { AreaRequest } from '../../Utils/AreaRequest';
export interface IGeneralRequester {
	GetResquest(kingdom: GlobalIa): AreaRequest;
}
