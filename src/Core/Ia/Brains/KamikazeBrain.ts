import { DiamondExpansionMaker } from '../Decision/ExpansionMaker/DiamondExpansionMaker';
import { HandlerIterator } from '../Decision/Handlers/RequestHandler';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Brain } from '../Decision/Brain';
import { IBrain } from '../Decision/IBrain';
import { AreaRequestIterator } from '../Decision/Requests/AreaRequestIterator';
import { GlobalRequestIterator } from '../Decision/Requests/Global/GlobalRequestIterator';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IBrainProvider } from './IBrain';
import { SimpleSquadCondition } from '../Decision/Requests/Global/Requesters/SimpleSquadCondition';
import { SimpleTankHander } from '../Decision/Handlers/Handler/SimpleTankHander';
import { GlobalRequester } from '../Decision/Requests/Global/GlobalRequester';
import { RequestType } from '../Decision/Utils/RequestType';
import { SimpleHandler } from '../Decision/Handlers/SimpleHandler';

export class KamikazeBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, hqs: Headquarter[], areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas, diamond, true);

		const handlers = [
			new SimpleHandler(10, RequestType.IdleTruck, (e) => new SimpleTankHander(hqs, brain).Handle(e))
		];
		brain.Inject(
			new DiamondExpansionMaker(hq, brain, areaSearch, 0),
			new GlobalRequestIterator([
				new GlobalRequester(7, RequestType.Raid, (e) => new SimpleSquadCondition().Condition(e))
			]),
			new AreaRequestIterator([]),
			new HandlerIterator(handlers)
		);

		return brain;
	}
}
