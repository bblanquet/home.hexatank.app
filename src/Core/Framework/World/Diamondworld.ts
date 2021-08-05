import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Identity } from '../../Items/Identity';
import { Item } from '../../Items/Item';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { IHqGameworld } from './IHqGameworld';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { SimpleEvent } from '../../../Utils/Events/SimpleEvent';
import { GameStatus } from '../GameStatus';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { GameState } from './GameState';
import { Diamond } from '../../Items/Cell/Field/Diamond';
export class Diamondworld implements IHqGameworld {
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public OnTimerDone: SimpleEvent;
	public Duration: number = 120;
	public State: GameState;

	private _cells: Dictionary<Cell>;

	constructor(state: GameState, cells: Cell[], public Hq: Headquarter, public Diamond: Diamond) {
		this._cells = Dictionary.To((c) => c.Coo(), cells);
		this.State = state;
		this.OnTimerDone = new SimpleEvent();
		this.Hq.OnDiamondEarned.On(() => {
			if (35 <= this.Hq.GetDiamondCount()) {
				this.State.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
			}
		});
		this.OnTimerDone.On(() => {
			if (35 <= this.Hq.GetDiamondCount()) {
				this.State.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
			} else {
				this.State.OnGameStatusChanged.Invoke(this, GameStatus.Defeat);
			}
		});
	}

	SetStatus(status: GameStatus): void {
		this.State.OnGameStatusChanged.Invoke(this, status);
	}

	GetHqs(): IHeadquarter[] {
		return [ this.Hq ];
	}

	GetDiamond(): number {
		return 35;
	}

	GetVehicles(): Vehicle[] {
		return [];
	}

	GetPlayerHq(): IHeadquarter {
		return this.Hq;
	}

	GetHqFromId(identity: Identity): IHeadquarter {
		if (this.Hq.Identity.Name === identity.Name) {
			return this.Hq;
		}
		return null;
	}
	GetCells(): Cell[] {
		return this._cells.Values();
	}
	GetPlayer(): AliveItem {
		return this.Hq;
	}
}
