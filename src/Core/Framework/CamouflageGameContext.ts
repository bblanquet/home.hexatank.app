import { Tank } from './../Items/Unit/Tank';
import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { Vehicle } from './../Items/Unit/Vehicle';
import { LiteEvent } from '../Utils/Events/LiteEvent';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { GameStatus } from './GameStatus';
import { isNullOrUndefined } from '../Utils/ToolBox';
import { IGameContext } from './IGameContext';
import { AliveItem } from '../Items/AliveItem';

export class CamouflageGameContext implements IGameContext {
	//should not be here
	public static Error: Error;
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();

	//ok
	public GameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();

	//elements
	private _cells: Dictionnary<Cell>;
	private _vehicles: Dictionnary<Vehicle> = new Dictionnary<Vehicle>();
	constructor(cells: Cell[]) {
		this._cells = Dictionnary.To((c) => c.Coo(), cells);
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
		return null;
	}
}
