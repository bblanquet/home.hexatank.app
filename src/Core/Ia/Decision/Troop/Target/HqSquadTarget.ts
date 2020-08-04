import { ISquadTarget } from './ISquadTarget';
import { Cell } from '../../../../Items/Cell/Cell';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';

export class HqSquadTarget implements ISquadTarget {
	constructor(private _cell: Cell, private _hqSquad: Headquarter) {}

	GetCell(): Cell {
		return this._cell;
	}
	IsDone(): boolean {
		return this._cell.GetField() instanceof BasicField;
	}
}
