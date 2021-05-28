import { isNullOrUndefined } from 'util';
import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Tank } from '../../Items/Unit/Tank';
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
	public GameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();

	//elements
	private _cells: Dictionnary<Cell>;
	private _vehicles: Dictionnary<Vehicle> = new Dictionnary<Vehicle>();
	constructor(cells: Cell[], unit: Vehicle, arrivelCell: Cell) {
		this._cells = Dictionnary.To((c) => c.Coo(), cells);
		this._unit = unit;

		this._unit.OnDestroyed.On(() => {
			this.GameStatusChanged.Invoke(this, GameStatus.Lost);
		});
		this._unit.OnCellChanged.On((source: any, cell: Cell) => {
			if (this._unit.GetCurrentCell() === arrivelCell) {
				this.GameStatusChanged.Invoke(this, GameStatus.Won);
			}
		});
	}

	public ExistUnit(id: string): Boolean {
		return this._vehicles.Exist(id);
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}

	public GetCell(coo: string): Cell {
		return this._cells.Get(coo);
	}

	public GetTank(id: string): Tank {
		const result = this._vehicles.Get(id);
		if (isNullOrUndefined(result) || !(result instanceof Tank)) {
			throw 'synchronized issue';
		}
		return result as Tank;
	}

	public GetUnit(id: string): Vehicle {
		const result = this._vehicles.Get(id);
		if (isNullOrUndefined(result)) {
			throw 'synchronized issue';
		}
		return result;
	}

	GetPlayer(): AliveItem {
		return this._unit;
	}
}
