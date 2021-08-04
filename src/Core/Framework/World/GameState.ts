import { GameStatus } from '../../Framework/GameStatus';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { Item } from '../../Items/Item';

export class GameState {
	public static Error: Error;
	public GameStatus: GameStatus = GameStatus.Pending;
	public OnGameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();
	private _isPause: boolean = false;
	private _hasInteraction: boolean = true;

	public SetPause(value: boolean): void {
		this._isPause = value;
		this._hasInteraction = value;
	}

	public IsPause(): boolean {
		return this._isPause;
	}

	public SetInteraction(value: boolean): void {
		this._hasInteraction = value;
	}

	public HasInteraction(): boolean {
		return this._hasInteraction;
	}
}
