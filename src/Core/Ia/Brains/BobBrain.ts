import { PowerUpRequester } from './../Decision/Requests/Area/PowerUpRequester';
import { ShieldFieldBorderRequestHandler } from './../Decision/Handlers/Handler/Field/ShieldFieldBorderRequestHandler';
import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { DiamondRoadRequester } from './../Decision/Requests/Area/DiamondRoadRequester';
import { DiamondRoadCleaningHandler } from './../Decision/Handlers/Handler/DiamondRoadCleaningHandler';
import { SimpleFarmFieldRequester } from '../Decision/Requests/Area/Field/SimpleFarmFieldRequester';
import { ReactorShieldHandler } from '../Decision/Handlers/Handler/Field/ReactorShieldHandler';
import { ReactorShieldRequester } from '../Decision/Requests/Area/Field/ReactorShieldRequester';
import { FoeReactorRequester } from './../Decision/Requests/Area/FoeReactorRequester';
import { EnemyReactorHandler } from './../Decision/Handlers/Handler/EnemyReactorHandler';
import { SpeedUpRequester } from './../Decision/Requests/Area/SpeedUpRequester';
import { SpeedUpHandler } from './../Decision/Handlers/Handler/SpeedUpHandler';
import { PowerUpRequestHandler } from './../Decision/Handlers/Handler/PowerUpRequestHandler';
import { DiamondExpansionMaker } from './../Decision/ExpansionMaker/DiamondExpansionMaker';
import { IBrainProvider } from './IBrain';
import { GameContext } from '../../Framework/Context/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Brain } from '../Decision/Brain';
import { RequestHandler } from '../Decision/Handlers/RequestHandler';
import { AreaRequestMaker } from '../Decision/Requests/AreaRequestMaker';
import { GeneralRequester } from '../Decision/Requests/Global/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { GeneralUpEnergyRequester } from '../Decision/Requests/Global/Requesters/GeneralUpEnergyRequest';
import { GeneralHealingRequester } from '../Decision/Requests/Global/Requesters/GeneralHealingRequester';
import { GeneralSquadRequest } from '../Decision/Requests/Global/Requesters/GeneralSquadRequest';
import { GeneralTruckRequester } from '../Decision/Requests/Global/Requesters/GeneralTruckRequester';
import { Groups } from '../../../Utils/Collections/Groups';
import { ClearRequestHandler } from '../Decision/Handlers/Handler/ClearRequestHandler';
import { EnergyRequestHandler } from '../Decision/Handlers/Handler/Field/EnergyRequestHandler';
import { FarmFieldRequestHandler } from '../Decision/Handlers/Handler/Field/FarmFieldRequestHandler';
import { HealingRequestHandler } from '../Decision/Handlers/Handler/Field/HealingRequestHandler';
import { HealUnitRequestHandler } from '../Decision/Handlers/Handler/HealUnitRequestHandler';
import { ReactorRequestHandler } from '../Decision/Handlers/Handler/ReactorRequestHandler';
import { ShieldRequestHandler } from '../Decision/Handlers/Handler/Field/ShieldRequestHandler';
import { SquadRequestHandler } from '../Decision/Handlers/Handler/SquadRequestHandler';
import { TankHighRequestHandler } from '../Decision/Handlers/Handler/TankHighRequestHandler';
import { TankMediumRequestHandler } from '../Decision/Handlers/Handler/TankMediumRequestHandler';
import { TruckRequestHandler } from '../Decision/Handlers/Handler/TruckRequestHandler';
import { ISimpleRequestHandler } from '../Decision/Handlers/ISimpleRequestHandler';
import { ClearAreaRequester } from '../Decision/Requests/Area/ClearAreaRequester';
import { HealUnitRequester } from '../Decision/Requests/Area/HealUnitRequester';
import { ReactorFieldRequester } from '../Decision/Requests/Area/Field/ReactorFieldRequester';
import { ShieldFieldAreaRequester } from '../Decision/Requests/Area/Field/ShieldFieldAreaRequester';
import { ShieldBorderRequester } from '../Decision/Requests/Area/Field/ShieldBorderRequester';
import { TankRequester } from '../Decision/Requests/Area/TankHighRequester';
import { TruckRequest } from '../Decision/Requests/Area/TruckRequester';
import { TankLowRequester } from '../Decision/Requests/Area/TankLowRequester';
import { TankMediumRequester } from '../Decision/Requests/Area/TankMediumRequester';
import { IBrain } from '../Decision/IBrain';

export class BobBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, context: GameContext, areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new EnemyReactorHandler());
		handlers.Add('10', new PowerUpRequestHandler());
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

		handlers.Add('5', new FarmFieldRequestHandler(hq));
		handlers.Add('5', new TankMediumRequestHandler(brain, hq));
		handlers.Add('5', new ShieldFieldBorderRequestHandler(hq));
		handlers.Add('5', new ShieldRequestHandler(hq));

		handlers.Add('2', new HealUnitRequestHandler(brain));
		handlers.Add('2', new HealingRequestHandler(hq));

		handlers.Add('1', new TankMediumRequestHandler(brain, hq));

		brain.Setup(
			new AreaRequestMaker([
				new PowerUpRequester(brain, 10),
				new ReactorShieldRequester(9),
				new DiamondRoadRequester(7, brain),
				new ShieldBorderRequester(5),
				new SpeedUpRequester(brain, 7),
				new ReactorFieldRequester(10),
				new FoeReactorRequester(10),
				new ShieldFieldAreaRequester(5),
				new HealUnitRequester(brain, 2),
				new ClearAreaRequester(10),
				new TruckRequest(10, 2),
				new SimpleFarmFieldRequester(5),
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
