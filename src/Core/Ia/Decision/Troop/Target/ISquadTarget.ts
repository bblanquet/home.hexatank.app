import { Tank } from './../../../../Items/Unit/Tank';
import { Cell } from '../../../../Items/Cell/Cell';
export interface ISquadTarget {
	GetCell(): Cell;
	IsDone(): boolean;
	Attack(t: Tank): void;
}
