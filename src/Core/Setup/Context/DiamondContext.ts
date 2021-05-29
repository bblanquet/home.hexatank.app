import { AliveItem } from '../../Items/AliveItem';
import { Cell } from '../../Items/Cell/Cell';
import { Identity } from '../../Items/Identity';
import { Item } from '../../Items/Item';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IHqGameContext } from './IHqGameContext';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
export class DiamondContext implements IHqGameContext {
	public OnPatrolSetting: LiteEvent<Boolean> = new LiteEvent<Boolean>();
	public OnItemSelected: LiteEvent<Item> = new LiteEvent<Item>();
	private _cells: Dictionnary<Cell>;

	constructor(cells: Cell[], private _hq: Headquarter) {
		this._cells = Dictionnary.To((c) => c.Coo(), cells);
	}

	GetPlayerHq(): IHeadquarter {
		return this._hq;
	}
	GetHqFromId(identity: Identity): IHeadquarter {
		if (this._hq.Identity.Name === identity.Name) {
			return this._hq;
		}
		return null;
	}
	GetCells(): Cell[] {
		return this._cells.Values();
	}
	GetPlayer(): AliveItem {
		return this._hq;
	}
}
