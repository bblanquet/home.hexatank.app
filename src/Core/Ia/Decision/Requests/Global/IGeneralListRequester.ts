import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';

export interface IGeneralListRequester {
	GetResquest(kingdom: Brain): AreaRequest[];
}
