import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { DiamondRoadRequester } from '../Decision/Requests/Area/DiamondRoadRequester';
import { DiamondRoadCleaningHandler } from '../Decision/Handlers/Handler/DiamondRoadCleaningHandler';
import { FoeReactorRequester } from '../Decision/Requests/Area/FoeReactorRequester';
import { EnemyReactorHandler } from '../Decision/Handlers/Handler/EnemyReactorHandler';
import { DiamondExpansionMaker } from '../Decision/ExpansionMaker/DiamondExpansionMaker';
import { IBrainProvider } from './IBrain';
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
import { DefenseHandler } from '../Decision/Handlers/Handler/DefenseHandler';
import { ReactorRequestHandler } from '../Decision/Handlers/Handler/ReactorRequestHandler';
import { PatrolRequest } from '../Decision/Requests/Area/PatrolRequest';
import { SquadRequestHandler } from '../Decision/Handlers/Handler/SquadRequestHandler';
import { TankHighRequestHandler } from '../Decision/Handlers/Handler/TankHighRequestHandler';
import { TankMediumRequestHandler } from '../Decision/Handlers/Handler/TankMediumRequestHandler';
import { TruckRequestHandler } from '../Decision/Handlers/Handler/TruckRequestHandler';
import { ISimpleRequestHandler } from '../Decision/Handlers/ISimpleRequestHandler';
import { ClearAreaRequester } from '../Decision/Requests/Area/ClearAreaRequester';
import { PatrolHandler } from '../Decision/Handlers/Handler/PatrolHandler';
import { TankRequester } from '../Decision/Requests/Area/TankHighRequester';
import { TruckRequest } from '../Decision/Requests/Area/TruckRequester';
import { DefenseRequester } from '../Decision/Requests/Area/DefenseRequester';
import { TankLowRequester } from '../Decision/Requests/Area/TankLowRequester';
import { TankMediumRequester } from '../Decision/Requests/Area/TankMediumRequester';
import { IBrain } from '../Decision/IBrain';
import { IdleTruckHandler } from '../Decision/Handlers/Handler/IdleTruckHandler';
import { IdleTruckRequester } from '../Decision/Requests/Global/Requesters/IdleTruckRequester';

export class WeakBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: Headquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, diamond, true);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new IdleTruckHandler(brain));

		handlers.Add('10', new EnemyReactorHandler());
		handlers.Add('10', new DefenseHandler());
		handlers.Add('10', new ClearRequestHandler());
		handlers.Add('10', new ReactorRequestHandler(hq, hqs));
		handlers.Add('10', new TankHighRequestHandler(brain, new TankMediumRequestHandler(brain, hq)));
		handlers.Add('10', new TruckRequestHandler(hq, brain));

		handlers.Add('7', new DiamondRoadCleaningHandler(brain));
		handlers.Add('7', new SquadRequestHandler(hqs, brain));

		handlers.Add('5', new TankMediumRequestHandler(brain, hq));

		handlers.Add('1', new PatrolHandler());
		handlers.Add('1', new TankMediumRequestHandler(brain, hq));

		brain.Setup(
			new AreaRequestMaker([
				new DefenseRequester(10),
				new DiamondRoadRequester(7, brain),
				new FoeReactorRequester(10),
				new ClearAreaRequester(10),
				new TruckRequest(10, 2),
				new TankRequester(10),
				new TankMediumRequester(5),
				new TankLowRequester(1),
				new PatrolRequest(1)
			]),
			new RequestHandler(handlers),
			new DiamondExpansionMaker(hq, brain, areaSearch, 2),
			new GeneralRequester([
				new GeneralTruckRequester(10),
				new IdleTruckRequester(10, brain),
				//new DiamondRoadRequest(7),
				new GeneralHealingRequester(2),
				new GeneralUpEnergyRequester(8),
				new GeneralSquadRequest(7, 8000, 2)
			])
		);

		return brain;
	}
}
