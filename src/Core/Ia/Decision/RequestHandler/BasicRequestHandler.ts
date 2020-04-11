import { RoadRequestHandler } from './Handler/RoadRequestHandler';
import { FarmRequestHandler } from './Handler/FarmRequestHandler';
import { TruckRequestHandler } from './Handler/TruckRequestHandler';
import { TankMediumRequestHandler } from './Handler/TankMediumRequestHandler';
import { TankHighRequestHandler } from './Handler/TankHighRequestHandler';
import { ISimpleRequestHandler } from './ISimpleRequestHandler';
import { Groups } from './../../../Utils/Collections/Groups';
import { Headquarter } from '../../../Items/Cell/Field/Headquarter';
import { IRequestHandler } from './IRequestHandler';
import { Kingdom } from '../Kingdom';
import { RequestPriority } from '../Utils/RequestPriority';
import { AreaRequest } from '../Utils/AreaRequest';

export class BasicRequestHandler implements IRequestHandler {
	private _handlers: Groups<ISimpleRequestHandler>;

	constructor(private _hq: Headquarter, private _decision: Kingdom) {
		this._handlers = new Groups<ISimpleRequestHandler>();
		this._handlers.Add(RequestPriority.High, new TruckRequestHandler(this._hq, this._decision));
		this._handlers.Add(
			RequestPriority.High,
			new TankHighRequestHandler(this._decision, new TankMediumRequestHandler(this._decision, this._hq))
		);
		this._handlers.Add(RequestPriority.Medium, new TankMediumRequestHandler(this._decision, this._hq));
		this._handlers.Add(RequestPriority.Low, new TankMediumRequestHandler(this._decision, this._hq));
		this._handlers.Add(RequestPriority.High, new RoadRequestHandler(this._hq));
		this._handlers.Add(RequestPriority.High, new FarmRequestHandler(this._hq));
	}

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
