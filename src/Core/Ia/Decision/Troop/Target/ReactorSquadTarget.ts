import { Headquarter } from './../../../../Items/Cell/Field/Hq/Headquarter';
import { ReactorField } from '../../../../Items/Cell/Field/Bonus/ReactorField';
import { ISquadTarget } from './ISquadTarget';
import { Cell } from '../../../../Items/Cell/Cell';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';

export class ReactorSquadTarget implements ISquadTarget {
	constructor(private _cell: Cell, private _hqSquad: Headquarter) {}

	GetCell(): Cell {
		return this._cell;
	}
	IsDone(): boolean {
		return (
			this._cell.GetField() instanceof BasicField ||
			(this._cell.GetField() instanceof ReactorField &&
				(this._cell.GetField() as ReactorField).Hq === this._hqSquad)
		);
	}
}
