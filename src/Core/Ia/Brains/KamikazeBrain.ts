import { DiamondExpansionMaker } from '../Decision/ExpansionMaker/DiamondExpansionMaker';
import { RequestHandler } from '../Decision/Handlers/RequestHandler';
import { EnemyReactorHandler } from '../Decision/Handlers/Handler/EnemyReactorHandler';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { GameContext } from '../../Framework/Context/GameContext';
import { Groups } from '../../../Utils/Collections/Groups';
import { Brain } from '../Decision/Brain';
import { IBrain } from '../Decision/IBrain';
import { ISimpleRequestHandler } from '../Decision/Handlers/ISimpleRequestHandler';
import { AreaRequestMaker } from '../Decision/Requests/AreaRequestMaker';
import { GeneralRequester } from '../Decision/Requests/Global/GeneralRequester';
import { Area } from '../Decision/Utils/Area';
import { AreaSearch } from '../Decision/Utils/AreaSearch';
import { IBrainProvider } from './IBrain';
import { GeneralRaidRequester } from '../Decision/Requests/Global/Requesters/GeneralRaidRequester';
import { SimpleTankHander } from '../Decision/Handlers/Handler/SimpleTankHander';

export class KamikazeBrain implements IBrainProvider {
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
