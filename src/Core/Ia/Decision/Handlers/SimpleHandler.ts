import { AreaRequest } from '../Utils/AreaRequest';
import { RequestType } from '../Utils/RequestType';
import { IHandler } from './IHandler';
import { ISimpleHandler } from './ISimpleRequestHandler';

export class SimpleHandler implements ISimpleHandler {
	constructor(private _priority: number, private _type: RequestType, private _handler: IHandler) {}

	Handle(request: AreaRequest): void {
		this._handler.Handle(request);
	}
	GetType(): RequestType {
		return this._type;
	}
	GetPriority(): number {
		return this._priority;
	}
}
