import { IaArea } from '../Utils/IaArea';
import { AreaRequest } from '../Utils/AreaRequest';

export interface IAreaRequestMaker {
	GetRequest(area: IaArea): AreaRequest;
}
