import { AreaRequest } from './../Utils/AreaRequest';
import { RequestType } from '../Utils/RequestType';
export interface ISimpleHandler {
	Handle(request: AreaRequest): void;
	GetType(): RequestType;
	GetPriority(): number;
}
