import { DiamondRoadRequest } from './../Decision/RequestMaker/GeneralRequester/Requesters/DiamondRoadRequest';
import { DiamondRoadHandler } from './../Decision/RequestHandler/Handler/DiamondRoadHandler';
import { SpeedUpRequester } from './../Decision/RequestMaker/AreaRequester/SpeedUpRequester';
import { SpeedUpHandler } from './../Decision/RequestHandler/Handler/SpeedUpHandler';
import { DiamondExpansionMaker } from './../Decision/ExpansionMaker/DiamondExpansionMaker';
import { IBrain } from './IBrain';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { GameContext } from '../../Framework/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { GlobalIa } from '../Decision/GlobalIa';
import { RequestHandler } from '../Decision/RequestHandler/RequestHandler';
import { AreaRequestMaker } from '../Decision/RequestMaker/AreaRequestMaker';
import { GeneralRequester } from '../Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IGlobalIa } from '../Decision/IGlobalIa';
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
import { FarmRequester } from '../Decision/RequestMaker/AreaRequester/FarmRequester';
import { HealUnitRequester } from '../Decision/RequestMaker/AreaRequester/HealUnitRequester';
import { ReactorRequester } from '../Decision/RequestMaker/AreaRequester/ReactorRequester';
import { ShieldAreaRequester } from '../Decision/RequestMaker/AreaRequester/ShieldAreaRequester';
import { ShieldBorderRequester } from '../Decision/RequestMaker/AreaRequester/ShieldBorderRequester';
import { TankRequester } from '../Decision/RequestMaker/AreaRequester/TankHighRequester';
import { TruckRequest } from '../Decision/RequestMaker/AreaRequester/TruckRequester';
import { TankLowRequester } from '../Decision/RequestMaker/AreaRequester/TankLowRequester';
import { TankMediumRequester } from '../Decision/RequestMaker/AreaRequester/TankMediumRequester';

export class BobBrain implements IBrain {
	GetBrain(
		hq: Headquarter,
		context: GameContext,
		areas: Area[],
		areaSearch: AreaSearch,
		diamond: Diamond
	): IGlobalIa {
		const brain = new GlobalIa(hq, areas);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new ClearRequestHandler());
		handlers.Add('10', new ReactorRequestHandler(hq, context));
		handlers.Add('8', new EnergyRequestHandler(hq));

		handlers.Add('7', new DiamondRoadHandler(brain, hq));
		handlers.Add('7', new SpeedUpHandler());

		handlers.Add('5', new FarmRequestHandler(hq));

		//defense
		handlers.Add('10', new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq)));
		handlers.Add('5', new TankMediumRequestHandler(brain, hq));
		handlers.Add('1', new TankMediumRequestHandler(brain, hq));

		//attack
		handlers.Add('7', new SquadRequestHandler(context, brain));

		handlers.Add('5', new ShieldBorderRequestHandler(hq));
		handlers.Add('5', new ShieldRequestHandler(hq));
		handlers.Add('2', new HealUnitRequestHandler(brain));
		handlers.Add('2', new HealingRequestHandler(hq));
		handlers.Add('2', new TruckRequestHandler(hq, brain));

		brain.Setup(
			new AreaRequestMaker([
				new ShieldBorderRequester(5),
				new SpeedUpRequester(brain, 7),
				new ReactorRequester(10),
				new ShieldAreaRequester(5),
				new HealUnitRequester(brain, 2),
				new ClearAreaRequester(10),
				new TruckRequest(2),
				new FarmRequester(5),
				new TankRequester(10),
				new TankMediumRequester(5),
				new TankLowRequester(1)
			]),
			new RequestHandler(handlers),
			new DiamondExpansionMaker(hq, brain, areaSearch),
			new GeneralRequester([
				new GeneralTruckRequester(2),
				new DiamondRoadRequest(7),
				new GeneralHealingRequester(2),
				new GeneralUpEnergyRequester(8),
				new GeneralSquadRequest(10)
			])
		);

		brain.SetDiamond(diamond);
		return brain;
	}
}
