import { Cell } from '../../../../Items/Cell/Cell';
export interface ISquadTarget {
	GetCell(): Cell;
	IsDone(): boolean;
}
