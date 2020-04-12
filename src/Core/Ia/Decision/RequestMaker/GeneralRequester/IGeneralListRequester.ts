import { Kingdom } from '../../Kingdom';
import { AreaRequest } from '../../Utils/AreaRequest';

export interface IGeneralListRequester {
	GetResquest(kingdom: Kingdom): AreaRequest[];
}
