import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';
export interface IGeneralRequester {
	GetResquest(kingdom: Brain): AreaRequest;
}
