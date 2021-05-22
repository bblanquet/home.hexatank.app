import { GlobalIa } from '../../GlobalIa';
import { AreaRequest } from '../../Utils/AreaRequest';

export interface IGeneralListRequester {
	GetResquest(kingdom: GlobalIa): AreaRequest[];
}
