import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { IBrainProvider } from './IBrain';
import { GameContext } from '../../Framework/Context/GameContext';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Brain } from '../Decision/Brain';
import { RequestHandler } from '../Decision/Handlers/RequestHandler';
import { AreaRequestMaker } from '../Decision/Requests/AreaRequestMaker';
import { GeneralRequester } from '../Decision/Requests/Global/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { Groups } from '../../../Utils/Collections/Groups';
import { ISimpleRequestHandler } from '../Decision/Handlers/ISimpleRequestHandler';
import { IBrain } from '../Decision/IBrain';
import { DummyExpansionMaker } from '../Decision/ExpansionMaker/DummyExpansionMaker';
import { IdleTruckHandler } from '../Decision/Handlers/Handler/IdleTruckHandler';
import { IdleTruckRequester } from '../Decision/Requests/Global/Requesters/IdleTruckRequester';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';

export class TruckBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: IHeadquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, false);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new IdleTruckHandler(brain));

		brain.Setup(
			new AreaRequestMaker([]),
			new RequestHandler(handlers),
			new DummyExpansionMaker(),
			new GeneralRequester([ new IdleTruckRequester(10) ])
		);

		brain.SetDiamond(diamond);
		return brain;
	}
}
