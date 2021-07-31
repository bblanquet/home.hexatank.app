import { AreaRequest } from '../Utils/AreaRequest';
import { RequestType } from '../Utils/RequestType';
import { ISimpleHandler } from './ISimpleRequestHandler';

export class SimpleHandler implements ISimpleHandler {
	constructor(private _priority: number, private _type: RequestType, private _handle: (a: AreaRequest) => void) {}

	Handle(request: AreaRequest): void {
		this._handle(request);
	}
	GetType(): RequestType {
		return this._type;
	}
	GetPriority(): number {
		return this._priority;
	}
}
