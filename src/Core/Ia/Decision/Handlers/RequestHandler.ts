import { ISimpleHandler } from './ISimpleRequestHandler';
import { Groups } from '../../../../Utils/Collections/Groups';
import { IHandlerIterator } from './IHandlerIterator';
import { AreaRequest } from '../Utils/AreaRequest';
import { StaticLogger } from '../../../../Utils/Logger/StaticLogger';
import { LogKind } from '../../../../Utils/Logger/LogKind';
import { RequestId } from '../Requests/RequestId';

export class HandlerIterator implements IHandlerIterator {
	private _handlers: Groups<ISimpleHandler>;
	constructor(handlers: Array<ISimpleHandler>) {
		handlers.forEach((handler) => {
			this._handlers.Add(handler.GetPriority().toString(), handler);
		});
	}
	Exist(id: RequestId): boolean {
		return this._handlers.Values().some((v) => v.GetType() === id.Type && v.GetPriority() === id.Priority);
	}

	public Iterate(requests: Groups<AreaRequest>) {
		const priorities = requests.Keys().map((e) => +e).sort();
		for (let index = priorities.length - 1; index > -1; index--) {
			const priority = priorities[index].toString();
			requests.Get(priority).forEach((request) => {
				if (request.Area) {
					request.Area.OnRequestAdded.Invoke(this, request.RequestType);
				}

				const handler = this._handlers.Get(request.Priority).find((d) => d.GetType() === request.RequestType);
				if (!handler) {
					StaticLogger.Log(LogKind.error, `could not find ${request.RequestType} ${request.Priority}`);
				}
				handler.Handle(request);
			});
		}
	}
}
