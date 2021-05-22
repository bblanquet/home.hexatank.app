import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { GameContext } from '../../Framework/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { ExpansionMaker } from '../Decision/ExpansionMaker/ExpansionMaker';
import { GlobalIa } from '../Decision/GlobalIa';
import { RequestHandler } from '../Decision/RequestHandler/RequestHandler';
import { AreaRequestMaker } from '../Decision/RequestMaker/AreaRequestMaker';
import { GeneralRequester } from '../Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IGlobalIa } from './../Decision/IGlobalIa';
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
import { RequestPriority } from '../Decision/Utils/RequestPriority';
import { ClearAreaRequester } from '../Decision/RequestMaker/AreaRequester/ClearAreaRequester';
import { FarmRequester } from '../Decision/RequestMaker/AreaRequester/FarmRequester';
import { HealUnitRequester } from '../Decision/RequestMaker/AreaRequester/HealUnitRequester';
import { ReactorRequester } from '../Decision/RequestMaker/AreaRequester/ReactorRequester';
import { RoadRequester } from '../Decision/RequestMaker/AreaRequester/RoadRequester';
import { ShieldAreaRequester } from '../Decision/RequestMaker/AreaRequester/ShieldAreaRequester';
import { ShieldBorderRequester } from '../Decision/RequestMaker/AreaRequester/ShieldBorderRequester';
import { TankRequester } from '../Decision/RequestMaker/AreaRequester/TankRequester';
import { TruckRequest } from '../Decision/RequestMaker/AreaRequester/TruckRequester';

export class BrainProvider {
	public GetBrain1(
		hq: Headquarter,
		context: GameContext,
		areas: Area[],
		areaSearch: AreaSearch,
		diamond: Diamond
	): IGlobalIa {
		const brain = new GlobalIa(hq, areas);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add(RequestPriority.High, new ShieldBorderRequestHandler(hq));
		handlers.Add(RequestPriority.High, new ShieldRequestHandler(hq));
		handlers.Add(RequestPriority.High, new SquadRequestHandler(context, brain));
		handlers.Add(RequestPriority.High, new EnergyRequestHandler(hq));
		handlers.Add(RequestPriority.High, new ReactorRequestHandler(hq, context));
		handlers.Add(RequestPriority.High, new ClearRequestHandler());
		handlers.Add(RequestPriority.High, new HealUnitRequestHandler(brain));
		handlers.Add(RequestPriority.High, new HealingRequestHandler(hq));
		handlers.Add(RequestPriority.High, new TruckRequestHandler(hq, brain));
		handlers.Add(RequestPriority.High, new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq)));
		handlers.Add(RequestPriority.Medium, new TankMediumRequestHandler(brain, hq));
		handlers.Add(RequestPriority.Low, new TankMediumRequestHandler(brain, hq));
		handlers.Add(RequestPriority.Medium, new RoadRequestHandler(hq));
		handlers.Add(RequestPriority.High, new FarmRequestHandler(hq));

		brain.Setup(
			new AreaRequestMaker([
				new ShieldBorderRequester(),
				new ReactorRequester(),
				new ShieldAreaRequester(),
				new HealUnitRequester(brain),
				new ClearAreaRequester(),
				new TruckRequest(),
				new RoadRequester(),
				new FarmRequester(),
				new TankRequester()
			]),
			new RequestHandler(handlers),
			new ExpansionMaker(hq, brain, areaSearch),
			new GeneralRequester([
				new GeneralTruckRequester(),
				new GeneralHealingRequester(),
				new GeneralEnergyRequester(),
				new GeneralSquadRequest()
			])
		);

		brain.SetDiamond(diamond);
		return brain;
	}
}
