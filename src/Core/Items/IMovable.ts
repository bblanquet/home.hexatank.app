import { LiteEvent } from '../Utils/Events/LiteEvent';
import { Cell } from './Cell/Cell';

export interface IMovable {
	MoveNextCell(): void;
	GetNextCell(): Cell;
	GetCurrentCell(): Cell;
	GetTranslationDuration(): number;
	SetTranslationDuration(translation: number): void;
	OnTranslateStarted: LiteEvent<Cell>;
	OnTranslateStopped: LiteEvent<Cell>;
}
