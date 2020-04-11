import { Kingdom } from '../../Kingdom';
import { AreaRequest } from '../../Utils/AreaRequest';
export interface IGeneralRequester {
	GetResquest(Kingdom: Kingdom): AreaRequest;
}
