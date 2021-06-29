import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Identity } from '../../Items/Identity';
import { Item } from '../../Items/Item';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IHqGameContext } from './IHqGameContext';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { GameStatus } from '../../Framework/GameStatus';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { GameState } from './GameState';
export class DiamondContext implements IHqGameContext {
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public OnTimerDone: SimpleEvent;
	public Duration: number = 120;
	public State: GameState;

	private _cells: Dictionary<Cell>;

	constructor(state: GameState, cells: Cell[], private _hq: Headquarter) {
		this._cells = Dictionary.To((c) => c.Coo(), cells);
		this.State = state;
		this.OnTimerDone = new SimpleEvent();
		this.OnTimerDone.On(() => {
			if (50 < this._hq.GetDiamondCount()) {
				this.State.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
			} else {
				this.State.OnGameStatusChanged.Invoke(this, GameStatus.Defeat);
			}
		});
	}
	GetVehicles(): Vehicle[] {
		return [];
	}

	GetPlayerHq(): IHeadquarter {
		return this._hq;
	}

	GetHqFromId(identity: Identity): IHeadquarter {
		if (this._hq.Identity.Name === identity.Name) {
			return this._hq;
		}
		return null;
	}
	GetCells(): Cell[] {
		return this._cells.Values();
	}
	GetPlayer(): AliveItem {
		return this._hq;
	}
}
