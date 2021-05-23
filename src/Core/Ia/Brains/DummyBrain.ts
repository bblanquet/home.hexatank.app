import { IBrain } from './IBrain';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { GameContext } from '../../Framework/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { ExpansionMaker } from '../Decision/ExpansionMaker/ExpansionMaker';
import { GlobalIa } from '../Decision/GlobalIa';
import { RequestHandler } from '../Decision/RequestHandler/RequestHandler';
import { AreaRequestMaker } from '../Decision/RequestMaker/AreaRequestMaker';
import { GeneralRequester } from '../Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IGlobalIa } from '../Decision/IGlobalIa';
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

export class DummyBrain implements IBrain {
	GetBrain(
		hq: Headquarter,
		context: GameContext,
		areas: Area[],
		areaSearch: AreaSearch,
		diamond: Diamond
	): IGlobalIa {
		const brain = new GlobalIa(hq, areas);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new ShieldBorderRequestHandler(hq));
		handlers.Add('10', new ShieldRequestHandler(hq));
		handlers.Add('10', new SquadRequestHandler(context, brain));
		handlers.Add('10', new EnergyRequestHandler(hq));
		handlers.Add('10', new ReactorRequestHandler(hq, context));
		handlers.Add('10', new ClearRequestHandler());
		handlers.Add('10', new HealUnitRequestHandler(brain));
		handlers.Add('10', new HealingRequestHandler(hq));
		handlers.Add('10', new TruckRequestHandler(hq, brain));
		handlers.Add('10', new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq)));
		handlers.Add('5', new TankMediumRequestHandler(brain, hq));
		handlers.Add('1', new TankMediumRequestHandler(brain, hq));
		handlers.Add('10', new FarmRequestHandler(hq));

		brain.Setup(
			new AreaRequestMaker([
				new ShieldBorderRequester(1),
				new ReactorRequester(1),
				new ShieldAreaRequester(1),
				new HealUnitRequester(brain, 1),
				new ClearAreaRequester(1),
				new TruckRequest(1),
				new FarmRequester(1),
				new TankRequester(1)
			]),
			new RequestHandler(handlers),
			new ExpansionMaker(hq, brain, areaSearch),
			new GeneralRequester([
				new GeneralTruckRequester(10),
				new GeneralHealingRequester(10),
				new GeneralEnergyRequester(10),
				new GeneralSquadRequest(10)
			])
		);

		brain.SetDiamond(diamond);
		return brain;
	}
}
