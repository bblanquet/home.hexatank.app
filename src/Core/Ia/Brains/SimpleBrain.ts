import { DiamondExpansionMaker } from './../Decision/ExpansionMaker/DiamondExpansionMaker';
import { RequestHandler } from './../Decision/RequestHandler/RequestHandler';
import { EnemyReactorHandler } from './../Decision/RequestHandler/Handler/EnemyReactorHandler';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { GameContext } from '../../Framework/Context/GameContext';
import { Groups } from '../../../Utils/Collections/Groups';
import { Brain } from '../Decision/Brain';
import { IBrain } from '../Decision/IBrain';
import { ISimpleRequestHandler } from '../Decision/RequestHandler/ISimpleRequestHandler';
import { AreaRequestMaker } from '../Decision/RequestMaker/AreaRequestMaker';
import { GeneralRequester } from '../Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { Area } from '../Decision/../Utils/Area';
import { AreaSearch } from '../Decision/../Utils/AreaSearch';
import { IBrainProvider } from './IBrain';
import { GeneralRaidRequester } from '../Decision/RequestMaker/GeneralRequester/Requesters/GeneralRaidRequester';
import { SimpleTankHander } from '../Decision/RequestHandler/Handler/SimpleTankHander';

export class SimpleBrain implements IBrainProvider {
	GetBrain(hq: Headquarter, context: GameContext, areas: Area[], areaSearch: AreaSearch, diamond: Diamond): IBrain {
		const brain = new Brain(hq, areas);

		const handlers = new Groups<ISimpleRequestHandler>();
		handlers.Add('10', new SimpleTankHander(context, brain));

		brain.Setup(
			new AreaRequestMaker([]),
			new RequestHandler(handlers),
			new DiamondExpansionMaker(hq, brain, areaSearch),
			new GeneralRequester([ new GeneralRaidRequester(10) ])
		);

		brain.SetDiamond(diamond);
		return brain;
	}
}
