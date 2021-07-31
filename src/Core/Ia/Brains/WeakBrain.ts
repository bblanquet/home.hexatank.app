import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { DiamondRoadCondition } from '../Decision/Requests/Area/DiamondRoadCondition';
import { DiamondRoadCleaningHandler } from '../Decision/Handlers/Handler/DiamondRoadCleaningHandler';
import { ReactorShieldHandler } from '../Decision/Handlers/Handler/Field/ReactorShieldHandler';
import { FoeReactorCondition } from '../Decision/Requests/Area/FoeReactorCondition';
import { EnemyReactorHandler as FoeReactorHandler } from '../Decision/Handlers/Handler/EnemyReactorHandler';
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
import { GeneralTruckCondition } from '../Decision/Requests/Global/Requesters/GeneralTruckCondition';
import { ClearRequestHandler } from '../Decision/Handlers/Handler/ClearRequestHandler';
import { EnergyRequestHandler } from '../Decision/Handlers/Handler/Field/EnergyRequestHandler';
import { DefenseHandler } from '../Decision/Handlers/Handler/DefenseHandler';
import { ReactorRequestHandler } from '../Decision/Handlers/Handler/ReactorRequestHandler';
import { PatrolCondition } from '../Decision/Requests/Area/PatrolCondition';
import { SquadRequestHandler } from '../Decision/Handlers/Handler/SquadRequestHandler';
import { TankHighRequestHandler } from '../Decision/Handlers/Handler/TankHighRequestHandler';
import { TankMediumRequestHandler } from '../Decision/Handlers/Handler/TankMediumRequestHandler';
import { TruckRequestHandler } from '../Decision/Handlers/Handler/TruckRequestHandler';
import { ClearAreaCondition } from '../Decision/Requests/Area/ClearAreaCondition';
import { PatrolHandler } from '../Decision/Handlers/Handler/PatrolHandler';
import { ReactorFieldCondition } from '../Decision/Requests/Area/Field/ReactorFieldCondition';
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

export class WeakBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: Headquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, diamond, true);

		const handlers = [
			new SimpleHandler(10, RequestType.IdleTruck, (e) => new IdleTruckHandler(brain).Handle(e)),
			new SimpleHandler(10, RequestType.FoeReactor, (e) => new FoeReactorHandler().Handle(e)),
			new SimpleHandler(10, RequestType.Defense, (e) => new DefenseHandler().Handle(e)),
			new SimpleHandler(10, RequestType.Clear, (e) => new ClearRequestHandler().Handle(e)),
			new SimpleHandler(10, RequestType.Reactor, (e) => new ReactorRequestHandler(hq, hqs).Handle(e)),
			new SimpleHandler(10, RequestType.Tank, (e) =>
				new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq)).Handle(e)
			),
			new SimpleHandler(10, RequestType.Truck, (e) => new TruckRequestHandler(hq, brain).Handle(e)),
			new SimpleHandler(9, RequestType.ReactorShield, (e) => new ReactorShieldHandler(hq).Handle(e)),
			new SimpleHandler(8, RequestType.Energy, (e) => new EnergyRequestHandler(hq).Handle(e)),
			new SimpleHandler(7, RequestType.DiamondRoadCleaning, (e) =>
				new DiamondRoadCleaningHandler(brain).Handle(e)
			),
			new SimpleHandler(7, RequestType.Raid, (e) => new SquadRequestHandler(hqs, brain).Handle(e)),
			new SimpleHandler(5, RequestType.Tank, (e) => new TankMediumRequestHandler(brain, hq).Handle(e)),
			new SimpleHandler(1, RequestType.Patrol, (e) => new PatrolHandler().Handle(e)),
			new SimpleHandler(1, RequestType.Tank, (e) => new TankMediumRequestHandler(brain, hq).Handle(e))
		];

		brain.Inject(
			new DiamondExpansionMaker(hq, brain, areaSearch, 2),
			new GlobalRequestIterator([
				new GlobalRequester(10, RequestType.Truck, (e) => new GeneralTruckCondition().Condition(e)),
				new GlobalRequester(10, RequestType.IdleTruck, (e) => new IdleTruckCondition().Condition(e)),
				new GlobalRequester(7, RequestType.Raid, (e) => new SquadCondition(8000, 2).Condition(e))
			]),
			new AreaRequestIterator([
				new AreaRequester(10, RequestType.Defense, (e) => new DefenseCondition().Condition(e)),
				new AreaRequester(10, RequestType.DiamondRoadCleaning, (e) =>
					new DiamondRoadCondition(brain).Condition(e)
				),
				new AreaRequester(10, RequestType.Reactor, (e) => new ReactorFieldCondition().Condition(e)),
				new AreaRequester(10, RequestType.FoeReactor, (e) => new FoeReactorCondition().Condition(e)),
				new AreaRequester(10, RequestType.Clear, (e) => new ClearAreaCondition().Condition(e)),
				new AreaRequester(10, RequestType.Truck, (e) => new TruckCondition(2).Condition(e)),
				new AreaRequester(10, RequestType.Tank, (e) => new TankHighCondition().Condition(e)),
				new AreaRequester(5, RequestType.Tank, (e) => new TankMediumCondition().Condition(e)),
				new AreaRequester(1, RequestType.Tank, (e) => new TankLowCondition().Condition(e)),
				new AreaRequester(1, RequestType.Patrol, (e) => new PatrolCondition().Condition(e))
			]),
			new HandlerIterator(handlers)
		);

		return brain;
	}
}
