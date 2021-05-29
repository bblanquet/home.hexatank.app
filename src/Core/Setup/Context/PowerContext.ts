import { IHqGameContext } from './IHqGameContext';
import { GameStatus } from '../../Framework/GameStatus';
import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { Identity } from '../../Items/Identity';

export class PowerContext implements IHqGameContext {
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

	GetPlayerHq(): Headquarter {
		throw new Error('Method not implemented.');
	}

	GetHqFromId(identity: Identity): IHeadquarter {
		throw new Error('Method not implemented.');
	}
}
