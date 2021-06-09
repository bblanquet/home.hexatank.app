import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { ISquadTarget } from './ISquadTarget';
import { Cell } from '../../../../Items/Cell/Cell';
import { TypeTranslator } from '../../../../Items/Cell/Field/TypeTranslator';

export class ReactorSquadTarget implements ISquadTarget {
	constructor(private _cell: Cell, private _hqSquad: Headquarter) {}

	GetCell(): Cell {
		return this._cell;
	}
	IsDone(): boolean {
		return !TypeTranslator.IsEnemy(this._cell.GetField(), this._hqSquad.Identity);
	}
}
