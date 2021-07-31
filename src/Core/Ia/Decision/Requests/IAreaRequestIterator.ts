import { AreaRequest } from '../Utils/AreaRequest';
import { BrainArea } from '../Utils/BrainArea';
import { RequestId } from './RequestId';

export interface IAreaRequestIterator {
	GetRequest(area: BrainArea): AreaRequest[];
	GetIds(): RequestId[];
}
