import { AreaRequest } from '../Utils/AreaRequest';
import { IaArea } from '../Utils/IaArea';

export interface IAreaRequestListMaker {
	GetRequest(area: IaArea): AreaRequest[];
}
