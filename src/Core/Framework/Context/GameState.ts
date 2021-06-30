import { GameStatus } from '../../Framework/GameStatus';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';

export class GameState {
	GameStatus: GameStatus = GameStatus.Pending;
	OnGameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();
	IsPause: boolean = false;
}
