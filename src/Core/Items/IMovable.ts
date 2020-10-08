import { Cell } from './Cell/Cell';

export interface IMovable {
	MoveNextCell(): void;
	GetNextCell(): Cell;
	SetNextCell(cell: Cell): void;
	GetCurrentCell(): Cell;
	GetTranslationDuration(): number;
	SetTranslationDuration(translation: number): void;
}
