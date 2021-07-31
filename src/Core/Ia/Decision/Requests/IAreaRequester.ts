import { BrainArea } from '../Utils/BrainArea';
import { AreaRequest } from '../Utils/AreaRequest';
import { RequestType } from '../Utils/RequestType';

export interface IAreaRequester {
	GetRequest(area: BrainArea): AreaRequest;
	GetPriority(): number;
	GetType(): RequestType;
}
