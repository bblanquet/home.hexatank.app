import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IGameContext } from './IGameContext';
export class PowerContext implements IGameContext {
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();
	public GameStatusChanged: LiteEvent<GameStatus> = new LiteEvent<GameStatus>();
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	private _cells: Dictionnary<Cell>;
	constructor(cells: Cell[], private _unit: AliveItem) {
		this._cells = Dictionnary.To((c) => c.Coo(), cells);
	}
	public GetCells(): Cell[] {
		return this._cells.Values();
	}
	GetPlayer(): AliveItem {
		return this._unit;
	}
}
