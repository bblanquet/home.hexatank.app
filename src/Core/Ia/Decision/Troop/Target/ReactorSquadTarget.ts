import { ISquadTarget } from './ISquadTarget';
import { Cell } from '../../../../Items/Cell/Cell';
import { Relationship } from '../../../../Items/Identity';
import { IHeadquarter } from '../../../../Items/Cell/Field/Hq/IHeadquarter';

export class ReactorSquadTarget implements ISquadTarget {
	constructor(private _cell: Cell, private _hqSquad: IHeadquarter) {}

	GetCell(): Cell {
		return this._cell;
	}
	IsDone(): boolean {
		return this._hqSquad.GetRelation(this._cell.GetField().GetIdentity()) !== Relationship.Enemy;
	}
}
