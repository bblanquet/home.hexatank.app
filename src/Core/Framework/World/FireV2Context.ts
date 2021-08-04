import { CellLessHeadquarter } from '../Worldmaker/Fire/CellLessHeadquarter';
import { IHqGameworld } from './IHqGameworld';
import { GameStatus } from '../GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { Identity } from '../../Items/Identity';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { GameState } from './GameState';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
export class FireV2World implements IHqGameworld {
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	private _cells: Dictionary<Cell>;
	public State: GameState;

	constructor(
		state: GameState,
		cells: Cell[],
		private _unit: AliveItem,
		private _fakeHq: CellLessHeadquarter,
		private _target: Headquarter
	) {
		this._cells = Dictionary.To((c) => c.Coo(), cells);
		this.State = state;
		this._target.OnDestroyed.On((source: any, data: Item) => {
			this.State.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
		});
	}

	SetStatus(status: GameStatus): void {
		this.State.OnGameStatusChanged.Invoke(this, status);
	}

	GetHqs(): IHeadquarter[] {
		return [ this._fakeHq ];
	}

	GetVehicles(): Vehicle[] {
		return [];
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}
	GetPlayer(): AliveItem {
		return this._unit;
	}

	GetPlayerHq(): IHeadquarter {
		return this._fakeHq;
	}

	GetHqFromId(identity: Identity): IHeadquarter {
		if (this._fakeHq.Identity.Name === identity.Name) {
			return this._fakeHq;
		}
		return null;
	}
}
