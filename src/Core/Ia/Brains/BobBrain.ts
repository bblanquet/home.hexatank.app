import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { DiamondRoadRequester } from './../Decision/RequestMaker/AreaRequester/DiamondRoadRequester';
import { DiamondRoadCleaningHandler } from './../Decision/RequestHandler/Handler/DiamondRoadCleaningHandler';
import { SimpleFarmRequester } from './../Decision/RequestMaker/AreaRequester/SimpleFarmRequester';
import { ReactorShieldHandler } from './../Decision/RequestHandler/Handler/ReactorShieldHandler';
import { ReactorShieldRequester } from './../Decision/RequestMaker/AreaRequester/ReactorShieldRequester';
import { FoeReactorRequester } from './../Decision/RequestMaker/AreaRequester/FoeReactorRequester';
import { EnemyReactorHandler } from './../Decision/RequestHandler/Handler/EnemyReactorHandler';
import { SpeedUpRequester } from './../Decision/RequestMaker/AreaRequester/SpeedUpRequester';
import { SpeedUpHandler } from './../Decision/RequestHandler/Handler/SpeedUpHandler';
import { DiamondExpansionMaker } from './../Decision/ExpansionMaker/DiamondExpansionMaker';
import { IBrainProvider } from './IBrain';
import { GameContext } from '../../Setup/Context/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Brain } from '../Decision/Brain';
import { RequestHandler } from '../Decision/RequestHandler/RequestHandler';
import { AreaRequestMaker } from '../Decision/RequestMaker/AreaRequestMaker';
import { GeneralRequester } from '../Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { GeneralUpEnergyRequester } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralUpEnergyRequest';
import { GeneralHealingRequester } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralHealingRequester';
import { GeneralSquadRequest } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralSquadRequest';
import { GeneralTruckRequester } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralTruckRequester';
import { Groups } from '../../Utils/Collections/Groups';
import { ClearRequestHandler } from '../Decision/RequestHandler/Handler/ClearRequestHandler';
import { EnergyRequestHandler } from '../Decision/RequestHandler/Handler/EnergyRequestHandler';
import { FarmRequestHandler } from '../Decision/RequestHandler/Handler/FarmRequestHandler';
import { HealingRequestHandler } from '../Decision/RequestHandler/Handler/HealingRequestHandler';
import { HealUnitRequestHandler } from '../Decision/RequestHandler/Handler/HealUnitRequestHandler';
import { ReactorRequestHandler } from '../Decision/RequestHandler/Handler/ReactorRequestHandler';
import { ShieldBorderRequestHandler } from '../Decision/RequestHandler/Handler/ShieldBorderRequestHandler';
import { ShieldRequestHandler } from '../Decision/RequestHandler/Handler/ShieldRequestHandler';
import { SquadRequestHandler } from '../Decision/RequestHandler/Handler/SquadRequestHandler';
import { TankHighRequestHandler } from '../Decision/RequestHandler/Handler/TankHighRequestHandler';
import { TankMediumRequestHandler } from '../Decision/RequestHandler/Handler/TankMediumRequestHandler';
import { TruckRequestHandler } from '../Decision/RequestHandler/Handler/TruckRequestHandler';
import { ISimpleRequestHandler } from '../Decision/RequestHandler/ISimpleRequestHandler';
import { ClearAreaRequester } from '../Decision/RequestMaker/AreaRequester/ClearAreaRequester';
import { HealUnitRequester } from '../Decision/RequestMaker/AreaRequester/HealUnitRequester';
import { ReactorRequester } from '../Decision/RequestMaker/AreaRequester/ReactorRequester';
import { ShieldAreaRequester } from '../Decision/RequestMaker/AreaRequester/ShieldAreaRequester';
import { ShieldBorderRequester } from '../Decision/RequestMaker/AreaRequester/ShieldBorderRequester';
import { TankRequester } from '../Decision/RequestMaker/AreaRequester/TankHighRequester';
import { TruckRequest } from '../Decision/RequestMaker/AreaRequester/TruckRequester';
import { TankLowRequester } from '../Decision/RequestMaker/AreaRequester/TankLowRequester';
import { TankMediumRequester } from '../Decision/RequestMaker/AreaRequester/TankMediumRequester';
import { IBrain } from '../Decision/IBrain';

export class BobBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, context: GameContext, areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new EnemyReactorHandler());
		handlers.Add('10', new ClearRequestHandler());
		handlers.Add('10', new ReactorRequestHandler(hq, context));
		handlers.Add('10', new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq)));
		handlers.Add('10', new TruckRequestHandler(hq, brain));

		handlers.Add('9', new ReactorShieldHandler(hq));

		handlers.Add('8', new EnergyRequestHandler(hq));

		//handlers.Add('7', new DiamondRoadHandler(brain, hq));
		handlers.Add('7', new DiamondRoadCleaningHandler(brain));
		handlers.Add('7', new SpeedUpHandler());
		handlers.Add('7', new SquadRequestHandler(context, brain));

		handlers.Add('5', new FarmRequestHandler(hq));
		handlers.Add('5', new TankMediumRequestHandler(brain, hq));
		handlers.Add('5', new ShieldBorderRequestHandler(hq));
		handlers.Add('5', new ShieldRequestHandler(hq));

		handlers.Add('2', new HealUnitRequestHandler(brain));
		handlers.Add('2', new HealingRequestHandler(hq));

		handlers.Add('1', new TankMediumRequestHandler(brain, hq));

		brain.Setup(
			new AreaRequestMaker([
				new ReactorShieldRequester(9),
				new DiamondRoadRequester(7, brain),
				new ShieldBorderRequester(5),
				new SpeedUpRequester(brain, 7),
				new ReactorRequester(10),
				new FoeReactorRequester(10),
				new ShieldAreaRequester(5),
				new HealUnitRequester(brain, 2),
				new ClearAreaRequester(10),
				new TruckRequest(10, 2),
				new SimpleFarmRequester(5),
				new TankRequester(10),
				new TankMediumRequester(5),
				new TankLowRequester(1)
			]),
			new RequestHandler(handlers),
			new DiamondExpansionMaker(hq, brain, areaSearch),
			new GeneralRequester([
				new GeneralTruckRequester(10),
				//new DiamondRoadRequest(7),
				new GeneralHealingRequester(2),
				new GeneralUpEnergyRequester(8),
				new GeneralSquadRequest(7, 8000, 2)
			])
		);

		brain.SetDiamond(diamond);
		return brain;
	}
}
