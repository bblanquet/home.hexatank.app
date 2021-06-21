import { LiteEvent } from '../Utils/Events/LiteEvent';
import { Cell } from './Cell/Cell';

export interface IMovable {
	GoNextCell(): void;
	GetNextCell(): Cell;
	GetCurrentCell(): Cell;
	GetTranslationDuration(): number;
	OnTranslateStarted: LiteEvent<Cell>;
	OnTranslateStopped: LiteEvent<Cell>;
}
