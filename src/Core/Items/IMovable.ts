import { Cell } from './Cell/Cell';

export interface IMovable {
	MoveNextCell(): void;
	GetNextCell(): Cell;
	SetNextCell(cell: Cell): void;
	GetCurrentCell(): Cell;
	TranslatingDuration: number;
}
