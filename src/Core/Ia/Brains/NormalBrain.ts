import { FireUpCondition } from '../Decision/Requests/Area/FireUpCondition';
import { ShieldFieldBorderRequestHandler } from '../Decision/Handlers/Handler/Field/ShieldFieldBorderRequestHandler';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { DiamondRoadCondition } from '../Decision/Requests/Area/DiamondRoadCondition';
import { DiamondRoadCleaningHandler } from '../Decision/Handlers/Handler/DiamondRoadCleaningHandler';
import { ReactorShieldHandler } from '../Decision/Handlers/Handler/Field/ReactorShieldHandler';
import { FoeReactorCondition } from '../Decision/Requests/Area/FoeReactorCondition';
import { SpeedUpCondtion } from '../Decision/Requests/Area/SpeedUpCondtion';
import { SpeedUpHandler } from '../Decision/Handlers/Handler/SpeedUpHandler';
import { DiamondExpansionMaker } from '../Decision/ExpansionMaker/DiamondExpansionMaker';
import { IBrainProvider } from './IBrain';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Brain } from '../Decision/Brain';
import { HandlerIterator } from '../Decision/Handlers/RequestHandler';
import { AreaRequestIterator } from '../Decision/Requests/AreaRequestIterator';
import { GlobalRequestIterator } from '../Decision/Requests/Global/GlobalRequestIterator';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { GlobalMedicFieldCondition } from '../Decision/Requests/Global/Requesters/GlobalMedicFieldCondition';
import { SquadCondition } from '../Decision/Requests/Global/Requesters/SquadCondition';
import { GlobalFarmCondition } from '../Decision/Requests/Global/Requesters/GlobalFarmCondition';
import { ClearHandler } from '../Decision/Handlers/Handler/ClearHandler';
import { EnergyRequestHandler } from '../Decision/Handlers/Handler/Field/EnergyRequestHandler';
import { FarmFieldRequestHandler } from '../Decision/Handlers/Handler/Field/FarmFieldRequestHandler';
import { HealingRequestHandler } from '../Decision/Handlers/Handler/Field/HealingRequestHandler';
import { FindMedicFieldHandler } from '../Decision/Handlers/Handler/FindMedicFieldHandler';
import { DefenseHandler } from '../Decision/Handlers/Handler/DefenseHandler';
import { ReactorRequestHandler } from '../Decision/Handlers/Handler/ReactorRequestHandler';
import { PatrolCondition } from '../Decision/Requests/Area/PatrolCondition';
import { ShieldRequestHandler } from '../Decision/Handlers/Handler/Field/ShieldRequestHandler';
import { SquadRequestHandler } from '../Decision/Handlers/Handler/SquadRequestHandler';
import { TankHighRequestHandler } from '../Decision/Handlers/Handler/TankHighRequestHandler';
import { TankMediumRequestHandler } from '../Decision/Handlers/Handler/TankMediumRequestHandler';
import { TruckHandler } from '../Decision/Handlers/Handler/TruckHandler';
import { ClearAreaCondition } from '../Decision/Requests/Area/ClearAreaCondition';
import { PatrolHandler } from '../Decision/Handlers/Handler/PatrolHandler';
import { FindMedicFieldCondition } from '../Decision/Requests/Area/FindMedicFieldCondition';
import { ReactorFieldCondition } from '../Decision/Requests/Area/Field/ReactorFieldCondition';
import { ShieldFieldBarrierCondition } from '../Decision/Requests/Area/Field/ShieldFieldBarrierCondition';
import { ShieldBorderCondition } from '../Decision/Requests/Area/Field/ShieldBorderCondition';
import { TankHighCondition } from '../Decision/Requests/Area/TankHighCondition';
import { TruckCondition } from '../Decision/Requests/Area/TruckCondition';
import { DefenseCondition } from '../Decision/Requests/Area/DefenseCondition';
import { TankLowCondition } from '../Decision/Requests/Area/TankLowCondition';
import { TankMediumCondition } from '../Decision/Requests/Area/TankMediumCondition';
import { IBrain } from '../Decision/IBrain';
import { IdleTruckCondition } from '../Decision/Requests/Global/Requesters/IdleTruckCondition';
import { GlobalBatteryCondition } from '../Decision/Requests/Global/Requesters/GlobalBatteryCondition';
import { IdleTruckHandler } from '../Decision/Handlers/Handler/IdleTruckHandler';
import { AreaRequester } from '../Decision/Requests/AreaRequester';
import { GlobalRequester } from '../Decision/Requests/Global/GlobalRequester';
import { RequestType } from '../Decision/Utils/RequestType';
import { SimpleHandler } from '../Decision/Handlers/SimpleHandler';
import { GameSettings } from '../../Framework/GameSettings';
import { EnemyReactorHandler } from '../Decision/Handlers/Handler/EnemyReactorHandler';
import { FireUpHandler } from '../Decision/Handlers/Handler/FireUpHandler';
import { HealUpHandler } from '../Decision/Handlers/Handler/HealUpHandler';
import { HealUpCondition } from '../Decision/Requests/Area/HealUpCondition';
import { GlobalTruckCondition } from '../Decision/Requests/Global/Requesters/GlobalTruckCondition';

export class NormalBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: Headquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, diamond, true);
		hq.DiamondCount = GameSettings.PocketMoney * 2;
		const handlers = [
			//behaviour
			new SimpleHandler(10, RequestType.IdleTruck, new IdleTruckHandler(brain)),
			new SimpleHandler(10, RequestType.FoeReactor, new EnemyReactorHandler()),
			new SimpleHandler(10, RequestType.Defense, new DefenseHandler()),
			new SimpleHandler(10, RequestType.Clear, new ClearHandler()),
			new SimpleHandler(7, RequestType.DiamondRoadCleaning, new DiamondRoadCleaningHandler(brain)),
			new SimpleHandler(7, RequestType.Raid, new SquadRequestHandler(hqs, brain)),
			new SimpleHandler(3, RequestType.HealUnit, new FindMedicFieldHandler(brain)),
			new SimpleHandler(1, RequestType.Patrol, new PatrolHandler()),

			//unit
			new SimpleHandler(
				10,
				RequestType.Tank,
				new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq))
			),
			new SimpleHandler(5, RequestType.Tank, new TankMediumRequestHandler(brain, hq)),
			new SimpleHandler(1, RequestType.Tank, new TankMediumRequestHandler(brain, hq)),
			new SimpleHandler(10, RequestType.Truck, new TruckHandler(hq, brain)),

			//powerup
			new SimpleHandler(10, RequestType.FireUp, new FireUpHandler()),
			new SimpleHandler(7, RequestType.SpeedUp, new SpeedUpHandler()),
			new SimpleHandler(5, RequestType.HealUp, new HealUpHandler()),

			//field
			new SimpleHandler(5, RequestType.BorderShieldField, new ShieldFieldBorderRequestHandler(hq)),
			new SimpleHandler(9, RequestType.ReactorShield, new ReactorShieldHandler(hq)),
			new SimpleHandler(5, RequestType.FarmField, new FarmFieldRequestHandler(hq)),
			new SimpleHandler(10, RequestType.ReactorField, new ReactorRequestHandler(hq, hqs)),
			new SimpleHandler(8, RequestType.BatteryField, new EnergyRequestHandler(hq)),
			new SimpleHandler(3, RequestType.MedicField, new HealingRequestHandler(hq)),
			new SimpleHandler(5, RequestType.ShieldField, new ShieldRequestHandler(hq))
		];

		brain.Inject(
			new DiamondExpansionMaker(hq, brain, areaSearch, 1),
			new GlobalRequestIterator([
				//unit
				new GlobalRequester(10, RequestType.Truck, new GlobalTruckCondition()),

				//field
				new GlobalRequester(8, RequestType.BatteryField, new GlobalBatteryCondition()),
				new GlobalRequester(5, RequestType.FarmField, new GlobalFarmCondition()),
				new GlobalRequester(3, RequestType.MedicField, new GlobalMedicFieldCondition()),

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

				//field
				new AreaRequester(9, RequestType.ReactorShield, new ReactorFieldCondition()),
				new AreaRequester(5, RequestType.ShieldField, new ShieldFieldBarrierCondition()),
				new AreaRequester(5, RequestType.BorderShieldField, new ShieldBorderCondition()),
				new AreaRequester(10, RequestType.ReactorField, new ReactorFieldCondition()),

				//powerup
				new AreaRequester(10, RequestType.FireUp, new FireUpCondition(brain)),
				new AreaRequester(7, RequestType.SpeedUp, new SpeedUpCondtion(brain)),
				new AreaRequester(5, RequestType.HealUp, new HealUpCondition(brain)),

				//behaviour
				new AreaRequester(3, RequestType.HealUnit, new FindMedicFieldCondition(brain)),
				new AreaRequester(10, RequestType.Defense, new DefenseCondition()),
				new AreaRequester(7, RequestType.DiamondRoadCleaning, new DiamondRoadCondition(brain)),
				new AreaRequester(10, RequestType.FoeReactor, new FoeReactorCondition()),
				new AreaRequester(10, RequestType.Clear, new ClearAreaCondition()),
				new AreaRequester(1, RequestType.Patrol, new PatrolCondition())
			]),
			new HandlerIterator(handlers)
		);

		return brain;
	}
}
