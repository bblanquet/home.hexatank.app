import { RoadFieldRequester } from './../Decision/Requests/Area/Field/RoadFieldRequester';
import { ShieldFieldBorderRequestHandler } from './../Decision/Handlers/Handler/Field/ShieldFieldBorderRequestHandler';
import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { IBrainProvider } from './IBrain';
import { GameContext } from '../../Framework/Context/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Brain } from '../Decision/Brain';
import { RequestHandler } from '../Decision/Handlers/RequestHandler';
import { AreaRequestMaker } from '../Decision/Requests/AreaRequestMaker';
import { GeneralRequester } from '../Decision/Requests/Global/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
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
import { TankRequester } from '../Decision/Requests/Area/TankHighRequester';
import { TruckRequest } from '../Decision/Requests/Area/TruckRequester';
import { TankLowRequester } from '../Decision/Requests/Area/TankLowRequester';
import { TankMediumRequester } from '../Decision/Requests/Area/TankMediumRequester';
import { IBrain } from '../Decision/IBrain';
import { ExpansionMaker } from '../Decision/ExpansionMaker/ExpansionMaker';
import { GeneralEnergyRequester } from '../Decision/Requests/Global/Requesters/GeneralEnergyRequester';

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
