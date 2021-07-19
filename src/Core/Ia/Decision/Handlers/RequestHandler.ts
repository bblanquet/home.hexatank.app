import { ISimpleRequestHandler } from './ISimpleRequestHandler';
import { Groups } from '../../../../Utils/Collections/Groups';
import { IRequestHandler } from './IRequestHandler';
import { AreaRequest } from '../Utils/AreaRequest';
import { StaticLogger } from '../../../../Utils/Logger/StaticLogger';
import { LogKind } from '../../../../Utils/Logger/LogKind';

export class RequestHandler implements IRequestHandler {
	constructor(private _handlers: Groups<ISimpleRequestHandler>) {}

	public HandleRequests(requests: Groups<AreaRequest>) {
		const priorities = requests.Keys().map((e) => +e).sort();
		for (let index = priorities.length - 1; index > -1; index--) {
			const priority = priorities[index].toString();
			requests.Get(priority).forEach((request) => {
				if (request.Area) {
					request.Area.OnRequestAdded.Invoke(this, request.RequestType);
				}

				const handler = this._handlers.Get(request.Priority).find((d) => d.Type() === request.RequestType);
				if (!handler) {
					StaticLogger.Log(LogKind.error, `could not find ${request.RequestType} ${request.Priority}`);
				}
				handler.Handle(request);
			});
		}
	}
}