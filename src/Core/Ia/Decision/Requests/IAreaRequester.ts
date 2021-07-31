import { IaArea } from '../Utils/IaArea';
import { AreaRequest } from '../Utils/AreaRequest';
import { RequestType } from '../Utils/RequestType';

export interface IAreaRequester {
	GetRequest(area: IaArea): AreaRequest;
	GetPriority(): number;
	GetType(): RequestType;
}
