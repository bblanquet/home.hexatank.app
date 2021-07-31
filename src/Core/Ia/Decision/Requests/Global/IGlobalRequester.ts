import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
export interface IGlobalRequester {
	GetResquest(brain: Brain): AreaRequest;
	GetPriority(): number;
	GetType(): RequestType;
}
