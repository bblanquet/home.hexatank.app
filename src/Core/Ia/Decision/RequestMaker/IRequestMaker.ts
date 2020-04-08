import { KingdomArea } from '../Utils/KingdomArea';
import { AreaRequest } from '../Utils/AreaRequest';

export interface IRequestMaker {
	GetRequest(area: KingdomArea): AreaRequest;
}
