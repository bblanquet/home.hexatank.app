import { ShieldRequestHandler } from './Handler/ShieldRequestHandler';
import { SquadRequestHandler } from './Handler/SquadRequestHandler';
import { EnergyRequestHandler } from './Handler/EnergyRequestHandler';
import { ReactorRequestHandler } from './Handler/ReactorRequestHandler';
import { ClearRequestHandler } from './Handler/ClearRequestHandler';
import { HealUnitRequestHandler } from './Handler/HealUnitRequestHandler';
import { HealingRequestHandler } from './Handler/HealingRequestHandler';
import { RoadRequestHandler } from './Handler/RoadRequestHandler';
import { FarmRequestHandler } from './Handler/FarmRequestHandler';
import { TruckRequestHandler } from './Handler/TruckRequestHandler';
import { TankMediumRequestHandler } from './Handler/TankMediumRequestHandler';
import { TankHighRequestHandler } from './Handler/TankHighRequestHandler';
import { ISimpleRequestHandler } from './ISimpleRequestHandler';
import { Groups } from '../../../Utils/Collections/Groups';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { IRequestHandler } from './IRequestHandler';
import { Kingdom } from '../Kingdom';
import { RequestPriority } from '../Utils/RequestPriority';
import { AreaRequest } from '../Utils/AreaRequest';
import { GameContext } from '../../../Framework/GameContext';

export class RequestHandler implements IRequestHandler {
	private _handlers: Groups<ISimpleRequestHandler>;

	constructor(private _hq: Headquarter, private _kindgom: Kingdom, context: GameContext) {
		this._handlers = new Groups<ISimpleRequestHandler>();
		this._handlers.Add(RequestPriority.High, new ShieldRequestHandler(this._hq));
		this._handlers.Add(RequestPriority.High, new SquadRequestHandler(context, this._kindgom));
		this._handlers.Add(RequestPriority.High, new EnergyRequestHandler(this._hq));
		this._handlers.Add(RequestPriority.High, new ReactorRequestHandler(this._hq, context));
		this._handlers.Add(RequestPriority.High, new ClearRequestHandler());
		this._handlers.Add(RequestPriority.High, new HealUnitRequestHandler(this._kindgom));
		this._handlers.Add(RequestPriority.High, new HealingRequestHandler(this._hq));
		this._handlers.Add(RequestPriority.High, new TruckRequestHandler(this._hq, this._kindgom));
		this._handlers.Add(
			RequestPriority.High,
			new TankHighRequestHandler(this._kindgom, new TankMediumRequestHandler(this._kindgom, this._hq))
		);
		this._handlers.Add(RequestPriority.Medium, new TankMediumRequestHandler(this._kindgom, this._hq));
		this._handlers.Add(RequestPriority.Low, new TankMediumRequestHandler(this._kindgom, this._hq));
		this._handlers.Add(RequestPriority.Medium, new RoadRequestHandler(this._hq));
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
