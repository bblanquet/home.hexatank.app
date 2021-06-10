import { RoadFieldRequester } from './../Decision/RequestMaker/AreaRequester/Field/RoadFieldRequester';
import { ShieldFieldBorderRequestHandler } from './../Decision/RequestHandler/Handler/Field/ShieldFieldBorderRequestHandler';
import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { IBrainProvider } from './IBrain';
import { GameContext } from '../../Setup/Context/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Brain } from '../Decision/Brain';
import { RequestHandler } from '../Decision/RequestHandler/RequestHandler';
import { AreaRequestMaker } from '../Decision/RequestMaker/AreaRequestMaker';
import { GeneralRequester } from '../Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { GeneralHealingRequester } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralHealingRequester';
import { GeneralSquadRequest } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralSquadRequest';
import { GeneralTruckRequester } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralTruckRequester';
import { Groups } from '../../Utils/Collections/Groups';
import { ClearRequestHandler } from '../Decision/RequestHandler/Handler/ClearRequestHandler';
import { EnergyRequestHandler } from '../Decision/RequestHandler/Handler/Field/EnergyRequestHandler';
import { FarmFieldRequestHandler } from '../Decision/RequestHandler/Handler/Field/FarmFieldRequestHandler';
import { HealingRequestHandler } from '../Decision/RequestHandler/Handler/Field/HealingRequestHandler';
import { HealUnitRequestHandler } from '../Decision/RequestHandler/Handler/HealUnitRequestHandler';
import { ReactorRequestHandler } from '../Decision/RequestHandler/Handler/ReactorRequestHandler';
import { ShieldRequestHandler } from '../Decision/RequestHandler/Handler/Field/ShieldRequestHandler';
import { SquadRequestHandler } from '../Decision/RequestHandler/Handler/SquadRequestHandler';
import { TankHighRequestHandler } from '../Decision/RequestHandler/Handler/TankHighRequestHandler';
import { TankMediumRequestHandler } from '../Decision/RequestHandler/Handler/TankMediumRequestHandler';
import { TruckRequestHandler } from '../Decision/RequestHandler/Handler/TruckRequestHandler';
import { ISimpleRequestHandler } from '../Decision/RequestHandler/ISimpleRequestHandler';
import { ClearAreaRequester } from '../Decision/RequestMaker/AreaRequester/ClearAreaRequester';
import { HealUnitRequester } from '../Decision/RequestMaker/AreaRequester/HealUnitRequester';
import { ReactorFieldRequester } from '../Decision/RequestMaker/AreaRequester/Field/ReactorFieldRequester';
import { ShieldFieldAreaRequester } from '../Decision/RequestMaker/AreaRequester/Field/ShieldFieldAreaRequester';
import { TankRequester } from '../Decision/RequestMaker/AreaRequester/TankHighRequester';
import { TruckRequest } from '../Decision/RequestMaker/AreaRequester/TruckRequester';
import { TankLowRequester } from '../Decision/RequestMaker/AreaRequester/TankLowRequester';
import { TankMediumRequester } from '../Decision/RequestMaker/AreaRequester/TankMediumRequester';
import { IBrain } from '../Decision/IBrain';
import { ExpansionMaker } from '../Decision/ExpansionMaker/ExpansionMaker';
import { GeneralEnergyRequester } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralEnergyRequester';

export class StandardBain implements IBrainProvider {
	GetBrain(hq: Headquarter, context: GameContext, areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq)));
		handlers.Add('5', new TankMediumRequestHandler(brain, hq));
		handlers.Add('1', new TankMediumRequestHandler(brain, hq));

		handlers.Add('10', new ReactorRequestHandler(hq, context));
		handlers.Add('10', new EnergyRequestHandler(hq));

		handlers.Add('10', new ShieldFieldBorderRequestHandler(hq));
		handlers.Add('10', new ShieldRequestHandler(hq));
		handlers.Add('10', new SquadRequestHandler(context, brain));
		handlers.Add('10', new ClearRequestHandler());
		handlers.Add('10', new HealUnitRequestHandler(brain));
		handlers.Add('10', new HealingRequestHandler(hq));
		handlers.Add('10', new TruckRequestHandler(hq, brain));

		handlers.Add('10', new FarmFieldRequestHandler(hq));

		brain.Setup(
			new AreaRequestMaker([
				new ReactorFieldRequester(10),
				new ShieldFieldAreaRequester(10),
				new HealUnitRequester(brain, 10),
				new ClearAreaRequester(10),
				new TruckRequest(10, 1),
				new RoadFieldRequester(5),
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
