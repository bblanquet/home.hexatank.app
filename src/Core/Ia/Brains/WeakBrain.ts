import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { DiamondRoadCondition } from '../Decision/Requests/Area/DiamondRoadCondition';
import { DiamondRoadCleaningHandler } from '../Decision/Handlers/Handler/DiamondRoadCleaningHandler';
import { DiamondExpansionMaker } from '../Decision/ExpansionMaker/DiamondExpansionMaker';
import { IBrainProvider } from './IBrain';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Brain } from '../Decision/Brain';
import { HandlerIterator } from '../Decision/Handlers/RequestHandler';
import { AreaRequestIterator } from '../Decision/Requests/AreaRequestIterator';
import { GlobalRequestIterator } from '../Decision/Requests/Global/GlobalRequestIterator';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { SquadCondition } from '../Decision/Requests/Global/Requesters/SquadCondition';
import { ClearHandler } from '../Decision/Handlers/Handler/ClearHandler';
import { DefenseHandler } from '../Decision/Handlers/Handler/DefenseHandler';
import { PatrolCondition } from '../Decision/Requests/Area/PatrolCondition';
import { SquadRequestHandler } from '../Decision/Handlers/Handler/SquadRequestHandler';
import { TankHighRequestHandler } from '../Decision/Handlers/Handler/TankHighRequestHandler';
import { TankMediumRequestHandler } from '../Decision/Handlers/Handler/TankMediumRequestHandler';
import { TruckHandler } from '../Decision/Handlers/Handler/TruckHandler';
import { ClearAreaCondition } from '../Decision/Requests/Area/ClearAreaCondition';
import { PatrolHandler } from '../Decision/Handlers/Handler/PatrolHandler';
import { TankHighCondition } from '../Decision/Requests/Area/TankHighCondition';
import { TruckCondition } from '../Decision/Requests/Area/TruckCondition';
import { DefenseCondition } from '../Decision/Requests/Area/DefenseCondition';
import { TankLowCondition } from '../Decision/Requests/Area/TankLowCondition';
import { TankMediumCondition } from '../Decision/Requests/Area/TankMediumCondition';
import { IBrain } from '../Decision/IBrain';
import { IdleTruckCondition } from '../Decision/Requests/Global/Requesters/IdleTruckCondition';
import { IdleTruckHandler } from '../Decision/Handlers/Handler/IdleTruckHandler';
import { AreaRequester } from '../Decision/Requests/AreaRequester';
import { GlobalRequester } from '../Decision/Requests/Global/GlobalRequester';
import { RequestType } from '../Decision/Utils/RequestType';
import { SimpleHandler } from '../Decision/Handlers/SimpleHandler';
import { GlobalTruckCondition } from '../Decision/Requests/Global/Requesters/GlobalTruckCondition';

export class WeakBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: Headquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, diamond, true);
		const handlers = [
			//behaviour
			new SimpleHandler(10, RequestType.IdleTruck, new IdleTruckHandler(brain)),
			new SimpleHandler(10, RequestType.Defense, new DefenseHandler()),
			new SimpleHandler(10, RequestType.Clear, new ClearHandler()),
			new SimpleHandler(7, RequestType.DiamondRoadCleaning, new DiamondRoadCleaningHandler(brain)),
			new SimpleHandler(7, RequestType.Raid, new SquadRequestHandler(hqs, brain)),
			new SimpleHandler(1, RequestType.Patrol, new PatrolHandler()),

			//unit
			new SimpleHandler(
				10,
				RequestType.Tank,
				new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq))
			),
			new SimpleHandler(5, RequestType.Tank, new TankMediumRequestHandler(brain, hq)),
			new SimpleHandler(1, RequestType.Tank, new TankMediumRequestHandler(brain, hq)),
			new SimpleHandler(10, RequestType.Truck, new TruckHandler(hq, brain))
		];

		brain.Inject(
			new DiamondExpansionMaker(hq, brain, areaSearch, 2),
			new GlobalRequestIterator([
				//unit
				new GlobalRequester(10, RequestType.Truck, new GlobalTruckCondition()),

				//behaviour
				new GlobalRequester(10, RequestType.IdleTruck, new IdleTruckCondition()),
				new GlobalRequester(7, RequestType.Raid, new SquadCondition(15000, 2))
			]),
			new AreaRequestIterator([
				//unit
				new AreaRequester(10, RequestType.Tank, new TankHighCondition()),
				new AreaRequester(5, RequestType.Tank, new TankMediumCondition()),
				new AreaRequester(1, RequestType.Tank, new TankLowCondition()),
				new AreaRequester(10, RequestType.Truck, new TruckCondition(2)),

				//behaviour
				new AreaRequester(10, RequestType.Defense, new DefenseCondition()),
				new AreaRequester(7, RequestType.DiamondRoadCleaning, new DiamondRoadCondition(brain)),
				new AreaRequester(10, RequestType.Clear, new ClearAreaCondition()),
				new AreaRequester(1, RequestType.Patrol, new PatrolCondition())
			]),
			new HandlerIterator(handlers)
		);

		return brain;
	}
}
