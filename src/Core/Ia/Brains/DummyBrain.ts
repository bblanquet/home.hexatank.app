import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { IBrainProvider } from './IBrain';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { ExpansionMaker } from '../Decision/ExpansionMaker/ExpansionMaker';
import { Brain } from '../Decision/Brain';
import { RequestHandler } from '../Decision/RequestHandler/RequestHandler';
import { AreaRequestMaker } from '../Decision/RequestMaker/AreaRequestMaker';
import { GeneralRequester } from '../Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { Area } from '../Decision/../Utils/Area';
import { AreaSearch } from '../Decision/../Utils/AreaSearch';
import { IBrain } from '../Decision/IBrain';
import { Groups } from '../../../Utils/Collections/Groups';
import { ISimpleRequestHandler } from '../Decision/RequestHandler/ISimpleRequestHandler';
import { GameContext } from '../../Framework/Context/GameContext';

export class DummyBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, context: GameContext, areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas);

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
