import { RequestPriority } from './../Utils/RequestPriority';
import { AreaRequest } from './../Utils/AreaRequest';
import { RequestType } from '../Utils/RequestType';
export interface ISimpleRequestHandler {
	Handle(request: AreaRequest): void;
	Type(): RequestType;
	Priority(): RequestPriority;
}
