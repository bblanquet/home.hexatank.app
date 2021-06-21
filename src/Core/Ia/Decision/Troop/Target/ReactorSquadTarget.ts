import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { ISquadTarget } from './ISquadTarget';
import { Cell } from '../../../../Items/Cell/Cell';

export class ReactorSquadTarget implements ISquadTarget {
	constructor(private _cell: Cell, private _hqSquad: Headquarter) {}

	GetCell(): Cell {
		return this._cell;
	}
	IsDone(): boolean {
		return !this._hqSquad.IsEnemy(this._cell.GetField().GetIdentity());
	}
}
