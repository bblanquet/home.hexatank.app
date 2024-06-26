import { CellLessHeadquarter } from '../Worldmaker/CellLessHeadquarter';
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
import { BlockingField } from '../../Items/Cell/Field/BlockingField';
export class Outpostworld implements IHqGameworld {
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	private _cells: Dictionary<Cell>;
	public State: GameState;

	constructor(
		state: GameState,
		cells: Cell[],
		private _cellLessHq: CellLessHeadquarter,
		private _playerUnit: AliveItem,
		public BatteryCell: Cell,
		public FireCell: Cell,
		public Boulder: BlockingField
	) {
		this._cells = Dictionary.To((c) => c.Coo(), cells);
		this.State = state;
		this._playerUnit.OnDamageReceived.On((source: Vehicle, data: number) => {
			if (this._playerUnit.HasFullLife() && !Boulder.IsAlive()) {
				this.State.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
			}
		});
		this.Boulder.OnDamageReceived.On((source: Vehicle, data: number) => {
			if (this._playerUnit.HasFullLife() && !Boulder.IsAlive()) {
				this.State.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
			}
		});
	}

	SetStatus(status: GameStatus): void {
		this.State.OnGameStatusChanged.Invoke(this, status);
	}

	GetHqs(): IHeadquarter[] {
		return [ this._cellLessHq ];
	}

	GetVehicles(): Vehicle[] {
		return [];
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}
	GetPlayer(): AliveItem {
		return this._playerUnit;
	}

	GetPlayerHq(): IHeadquarter {
		return this._cellLessHq;
	}

	GetHqFromId(identity: Identity): IHeadquarter {
		if (this._cellLessHq.Identity.Name === identity.Name) {
			return this._cellLessHq;
		}
		return null;
	}
}
