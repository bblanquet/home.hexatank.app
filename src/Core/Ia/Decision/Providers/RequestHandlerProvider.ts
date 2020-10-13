import { HealingRequestHandler } from './../RequestHandler/Handler/HealingRequestHandler';
import { RoadRequestHandler } from './../RequestHandler/Handler/RoadRequestHandler';
import { TankMediumRequestHandler } from './../RequestHandler/Handler/TankMediumRequestHandler';
import { ShieldRequestHandler } from './../RequestHandler/Handler/ShieldRequestHandler';
import { SquadRequestHandler } from './../RequestHandler/Handler/SquadRequestHandler';
import { TruckRequestHandler } from './../RequestHandler/Handler/TruckRequestHandler';
import { HealUnitRequestHandler } from './../RequestHandler/Handler/HealUnitRequestHandler';
import { ClearRequestHandler } from './../RequestHandler/Handler/ClearRequestHandler';
import { EnergyRequestHandler } from './../RequestHandler/Handler/EnergyRequestHandler';
import { ReactorRequestHandler } from './../RequestHandler/Handler/ReactorRequestHandler';
import { ShieldBorderRequestHandler } from './../RequestHandler/Handler/ShieldBorderRequestHandler';
import { TankHighRequestHandler } from './../RequestHandler/Handler/TankHighRequestHandler';
import { FarmRequestHandler } from './../RequestHandler/Handler/FarmRequestHandler';
import { Kingdom } from './../Kingdom';
import { Headquarter } from './../../../Items/Cell/Field/Hq/Headquarter';
import { Groups } from '../../../Utils/Collections/Groups';
import { ISimpleRequestHandler } from '../RequestHandler/ISimpleRequestHandler';
import { RequestPriority } from '../Utils/RequestPriority';
import { IRequestHandlerProvider } from './IRequestHandlerProvider';
import { GameContext } from '../../../Framework/GameContext';
export class RequestHandlerProvider implements IRequestHandlerProvider {
	constructor(private _hq: Headquarter, private _kingdom: Kingdom, private _context: GameContext) {}

	Get(): Groups<ISimpleRequestHandler> {
		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add(RequestPriority.High, new ShieldBorderRequestHandler(this._hq));
		handlers.Add(RequestPriority.High, new ShieldRequestHandler(this._hq));
		handlers.Add(RequestPriority.High, new SquadRequestHandler(this._context, this._kingdom));
		handlers.Add(RequestPriority.High, new EnergyRequestHandler(this._hq));
		handlers.Add(RequestPriority.High, new ReactorRequestHandler(this._hq, this._context));
		handlers.Add(RequestPriority.High, new ClearRequestHandler());
		handlers.Add(RequestPriority.High, new HealUnitRequestHandler(this._kingdom));
		handlers.Add(RequestPriority.High, new HealingRequestHandler(this._hq));
		handlers.Add(RequestPriority.High, new TruckRequestHandler(this._hq, this._kingdom));
		handlers.Add(
			RequestPriority.High,
			new TankHighRequestHandler(this._kingdom, new TankMediumRequestHandler(this._kingdom, this._hq))
		);
		handlers.Add(RequestPriority.Medium, new TankMediumRequestHandler(this._kingdom, this._hq));
		handlers.Add(RequestPriority.Low, new TankMediumRequestHandler(this._kingdom, this._hq));
		handlers.Add(RequestPriority.Medium, new RoadRequestHandler(this._hq));
		handlers.Add(RequestPriority.High, new FarmRequestHandler(this._hq));
		return handlers;
	}
}
