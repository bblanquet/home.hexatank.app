import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { IBrainProvider } from './IBrain';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { ExpansionMaker } from '../Decision/ExpansionMaker/ExpansionMaker';
import { Brain } from '../Decision/Brain';
import { HandlerIterator } from '../Decision/Handlers/RequestHandler';
import { AreaRequestIterator } from '../Decision/Requests/AreaRequestIterator';
import { GlobalRequestIterator } from '../Decision/Requests/Global/GlobalRequestIterator';
import { Area } from '../Decision//Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IBrain } from '../Decision/IBrain';
import { Groups } from '../../../Utils/Collections/Groups';
import { ISimpleHandler } from '../Decision/Handlers/ISimpleRequestHandler';

export class DummyBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: Headquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, diamond, true);

		const handlers = new Array<ISimpleHandler>();

		brain.Inject(
			new ExpansionMaker(hq, brain, areaSearch),
			new GlobalRequestIterator([]),
			new AreaRequestIterator([]),
			new HandlerIterator(handlers)
		);

		return brain;
	}
}
