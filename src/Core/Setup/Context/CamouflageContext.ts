import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IGameContext } from './IGameContext';

export class CamouflageContext implements IGameContext {
	private _unit: Vehicle;

	//should not be here
	public static Error: Error;
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();

	//ok
	public OnGameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();

	//elements
	private _cells: Dictionnary<Cell>;
	private _vehicles: Vehicle[];
	constructor(cells: Cell[], unit: Vehicle, vehicles: Vehicle[], arrivelCell: Cell) {
		this._cells = Dictionnary.To((c) => c.Coo(), cells);
		this._unit = unit;
		this._vehicles = vehicles;

		this._unit.OnDestroyed.On(() => {
			this.OnGameStatusChanged.Invoke(this, GameStatus.Defeat);
		});
		this._unit.OnCellChanged.On((source: any, cell: Cell) => {
			if (this._unit.GetCurrentCell() === arrivelCell) {
				this.OnGameStatusChanged.Invoke(this, GameStatus.Victory);
			}
		});
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
