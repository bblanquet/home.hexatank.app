import { Headquarter } from './../../../../Items/Cell/Field/Hq/Headquarter';
import { Reactor } from './../../../../Items/Cell/Field/Bonus/Reactor';
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
			(this._cell.GetField() instanceof Reactor && (this._cell.GetField() as Reactor).Hq === this._hqSquad)
		);
	}
}
