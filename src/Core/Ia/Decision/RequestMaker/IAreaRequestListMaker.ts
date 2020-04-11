import { AreaRequest } from '../Utils/AreaRequest';
import { KingdomArea } from '../Utils/KingdomArea';

export interface IAreaRequestListMaker {
	GetRequest(area: KingdomArea): AreaRequest[];
}
