import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { IBrainProvider } from './IBrain';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Brain } from '../Decision/Brain';
import { HandlerIterator } from '../Decision/Handlers/RequestHandler';
import { AreaRequestIterator } from '../Decision/Requests/AreaRequestIterator';
import { GlobalRequestIterator } from '../Decision/Requests/Global/GlobalRequestIterator';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IBrain } from '../Decision/IBrain';
import { DummyExpansionMaker } from '../Decision/ExpansionMaker/DummyExpansionMaker';
import { IdleTruckHandler } from '../Decision/Handlers/Handler/IdleTruckHandler';
import { IdleTruckCondition } from '../Decision/Requests/Global/Requesters/IdleTruckCondition';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { SimpleHandler } from '../Decision/Handlers/SimpleHandler';
import { RequestType } from '../Decision/Utils/RequestType';
import { GlobalRequester } from '../Decision/Requests/Global/GlobalRequester';

export class TruckBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: IHeadquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, diamond, false);

		const handlers = [ new SimpleHandler(10, RequestType.IdleTruck, new IdleTruckHandler(brain)) ];

		brain.Inject(
			new DummyExpansionMaker(),
			new GlobalRequestIterator([ new GlobalRequester(10, RequestType.IdleTruck, new IdleTruckCondition()) ]),
			new AreaRequestIterator([]),
			new HandlerIterator(handlers)
		);

		return brain;
	}
}
