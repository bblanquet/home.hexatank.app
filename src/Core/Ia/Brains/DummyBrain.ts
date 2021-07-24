import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { IBrainProvider } from './IBrain';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { ExpansionMaker } from '../Decision/ExpansionMaker/ExpansionMaker';
import { Brain } from '../Decision/Brain';
import { RequestHandler } from '../Decision/Handlers/RequestHandler';
import { AreaRequestMaker } from '../Decision/Requests/AreaRequestMaker';
import { GeneralRequester } from '../Decision/Requests/Global/GeneralRequester';
import { Area } from '../Decision//Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IBrain } from '../Decision/IBrain';
import { Groups } from '../../../Utils/Collections/Groups';
import { ISimpleRequestHandler } from '../Decision/Handlers/ISimpleRequestHandler';

export class DummyBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: Headquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, true);

		const handlers = new Groups<ISimpleRequestHandler>();

		brain.Setup(
			new AreaRequestMaker([]),
			new RequestHandler(handlers),
			new ExpansionMaker(hq, brain, areaSearch),
			new GeneralRequester([])
		);

		brain.SetDiamond(diamond);
		return null;
	}
}
