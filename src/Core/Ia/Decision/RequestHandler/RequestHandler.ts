import { ISimpleRequestHandler } from './ISimpleRequestHandler';
import { Groups } from '../../../Utils/Collections/Groups';
import { IRequestHandler } from './IRequestHandler';
import { RequestPriority } from '../Utils/RequestPriority';
import { AreaRequest } from '../Utils/AreaRequest';

export class RequestHandler implements IRequestHandler {
	constructor(private _handlers: Groups<ISimpleRequestHandler>) {}

	public HandleRequests(requests: Groups<AreaRequest>) {
		this.Handle(requests, RequestPriority.High);
		this.Handle(requests, RequestPriority.Medium);
		this.Handle(requests, RequestPriority.Low);
	}

	private Handle(requests: Groups<AreaRequest>, priority: RequestPriority) {
		if (requests.Exist(priority)) {
			requests.Get(priority).forEach((request) => {
				if (this._handlers.Exist(request.Priority)) {
					const handler = this._handlers
						.Get(request.Priority)
						.filter((d) => d.Type() === request.RequestType);
					if (0 < handler.length) {
						handler[0].Handle(request);
					}
				}
			});
		}
	}
}
