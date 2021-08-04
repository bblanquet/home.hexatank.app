import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { RecordContext } from '../../Core/Framework/Record/RecordContext';
import { Gameworld } from '../../Core/Framework/World/Gameworld';

export interface IRecordContextService {
	Register(blueprint: GameBlueprint, world: Gameworld): void;
	Publish(): RecordContext;
}
