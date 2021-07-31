import { AreaRequest } from './../Utils/AreaRequest';
export interface IHandler {
	Handle(request: AreaRequest): void;
}
