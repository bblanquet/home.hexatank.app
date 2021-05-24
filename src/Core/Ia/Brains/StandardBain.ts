import { IaHeadquarter } from '../IaHeadquarter';
import { TankMediumRequester } from '../Decision/RequestMaker/AreaRequester/TankMediumRequester';
import { TankLowRequester } from '../Decision/RequestMaker/AreaRequester/TankLowRequester';
import { IBrainProvider } from './IBrain';
import { GameContext } from '../../Framework/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { ExpansionMaker } from '../Decision/ExpansionMaker/ExpansionMaker';
import { RequestHandler } from '../Decision/RequestHandler/RequestHandler';
import { AreaRequestMaker } from '../Decision/RequestMaker/AreaRequestMaker';
import { GeneralRequester } from '../Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { GeneralEnergyRequester } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralEnergyRequester';
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
import { RoadRequestHandler } from '../Decision/RequestHandler/Handler/RoadRequestHandler';
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
import { RoadRequester } from '../Decision/RequestMaker/AreaRequester/RoadRequester';
import { ShieldAreaRequester } from '../Decision/RequestMaker/AreaRequester/ShieldAreaRequester';
import { ShieldBorderRequester } from '../Decision/RequestMaker/AreaRequester/ShieldBorderRequester';
import { TankRequester } from '../Decision/RequestMaker/AreaRequester/TankHighRequester';
import { TruckRequest } from '../Decision/RequestMaker/AreaRequester/TruckRequester';
import { Brain } from '../Decision/Brain';
import { IBrain } from '../Decision/IBrain';

export class StandardBain implements IBrainProvider {
	GetBrain(hq: IaHeadquarter, context: GameContext, areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq)));
		handlers.Add('5', new TankMediumRequestHandler(brain, hq));
		handlers.Add('1', new TankMediumRequestHandler(brain, hq));

		handlers.Add('10', new ReactorRequestHandler(hq, context));
		handlers.Add('10', new EnergyRequestHandler(hq));

		handlers.Add('10', new ShieldBorderRequestHandler(hq));
		handlers.Add('10', new ShieldRequestHandler(hq));
		handlers.Add('10', new SquadRequestHandler(context, brain));
		handlers.Add('10', new ClearRequestHandler());
		handlers.Add('10', new HealUnitRequestHandler(brain));
		handlers.Add('10', new HealingRequestHandler(hq));
		handlers.Add('10', new TruckRequestHandler(hq, brain));

		handlers.Add('5', new RoadRequestHandler(hq));
		handlers.Add('10', new FarmRequestHandler(hq));

		brain.Setup(
			new AreaRequestMaker([
				new ShieldBorderRequester(10),
				new ReactorRequester(10),
				new ShieldAreaRequester(10),
				new HealUnitRequester(brain, 10),
				new ClearAreaRequester(10),
				new TruckRequest(10, 1),
				new RoadRequester(5),
				new FarmRequester(10),
				new TankRequester(10),
				new TankMediumRequester(5),
				new TankLowRequester(1)
			]),
			new RequestHandler(handlers),
			new ExpansionMaker(hq, brain, areaSearch),
			new GeneralRequester([
				new GeneralTruckRequester(10),
				new GeneralHealingRequester(10),
				new GeneralEnergyRequester(10),
				new GeneralSquadRequest(10, 8000, 2)
			])
		);

		brain.SetDiamond(diamond);
		return brain;
	}
}
