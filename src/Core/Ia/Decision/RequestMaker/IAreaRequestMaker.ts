import { KingdomArea } from '../Utils/KingdomArea';
import { AreaRequest } from '../Utils/AreaRequest';

export interface IAreaRequestMaker {
	GetRequest(area: KingdomArea): AreaRequest;
}
