import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { Identity } from '../../Items/Identity';
import { Item } from '../../Items/Item';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IHqGameContext } from './IHqGameContext';
export class DiamondContext implements IHqGameContext {
	OnPatrolSetting: LiteEvent<Boolean>;
	OnItemSelected: LiteEvent<Item>;
	private _cells: Dictionnary<Cell>;

	constructor(cells: Cell[]) {
		this._cells = Dictionnary.To((c) => c.Coo(), cells);
	}

	GetPlayerHq(): IHeadquarter {
		return null;
	}
	GetHqFromId(identity: Identity): IHeadquarter {
		return null;
	}
	GetCells(): Cell[] {
		return this._cells.Values();
	}
	GetPlayer(): AliveItem {
		return null;
	}
}
