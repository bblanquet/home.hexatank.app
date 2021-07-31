import { AreaRequest } from '../Utils/AreaRequest';
import { IaArea } from '../Utils/IaArea';
import { RequestId } from './RequestId';

export interface IAreaRequestIterator {
	GetRequest(area: IaArea): AreaRequest[];
	GetIds(): RequestId[];
}
