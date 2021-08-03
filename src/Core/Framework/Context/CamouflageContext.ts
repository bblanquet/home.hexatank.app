import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { GameState } from './GameState';
import { IGameContext } from './IGameContext';

export class CamouflageContext implements IGameContext {
	private _unit: Vehicle;
	public State: GameState;

	//should not be here
	public static Error: Error;
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();

	//elements
	private _cells: Dictionary<Cell>;
	private _vehicles: Vehicle[];
	constructor(
		state: GameState,
		cells: Cell[],
		unit: Vehicle,
		vehicles: Vehicle[],
		public DepartCell: Cell,
		public ArrivalCell: Cell
	) {
		this._cells = Dictionary.To((c) => c.Coo(), cells);
		this._unit = unit;
		this._vehicles = vehicles;
		this.State = state;
		this._unit.OnDestroyed.On(() => {
			this.State.OnGameStatusChanged.Invoke(this, GameStatus.Defeat);
		});
		this._unit.OnCellChanged.On((source: any, cell: Cell) => {
			if (this._unit.GetCurrentCell() === ArrivalCell) {
				this.State.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
			}
		});
	}
	SetStatus(status: GameStatus): void {
		this.State.OnGameStatusChanged.Invoke(this, status);
	}

	public GetVehicles(): Vehicle[] {
		return this._vehicles;
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}

	public GetCell(coo: string): Cell {
		return this._cells.Get(coo);
	}

	GetPlayer(): AliveItem {
		return this._unit;
	}
}
