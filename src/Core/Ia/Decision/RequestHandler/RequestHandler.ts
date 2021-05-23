import { ISimpleRequestHandler } from './ISimpleRequestHandler';
import { Groups } from '../../../Utils/Collections/Groups';
import { IRequestHandler } from './IRequestHandler';
import { AreaRequest } from '../Utils/AreaRequest';

export class RequestHandler implements IRequestHandler {
	constructor(private _handlers: Groups<ISimpleRequestHandler>) {}

	public HandleRequests(requests: Groups<AreaRequest>) {
		const priorities = requests.Keys().map((e) => +e).sort();
		for (let index = priorities.length - 1; index > -1; index--) {
			const priority = priorities[index].toString();
			requests.Get(priority).forEach((request) => {
				console.log(`[${index}] ${request.RequestType} ${request.Priority}`);
				request.Area.OnRequestAdded.Invoke(this, request.RequestType);
				const handler = this._handlers.Get(request.Priority).find((d) => d.Type() === request.RequestType);
				if (!handler) {
					console.log(`could not find ${request.RequestType} ${request.Priority}`);
				}
				handler.Handle(request);
			});
		}
	}
}
