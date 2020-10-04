import { Cell } from '../../Items/Cell/Cell';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { OrderKind } from './OrderKind';
import { OrderState } from './OrderState';

export interface IOrder {
	OnPathCreated: LiteEvent<Cell[]>;
	OnNextCell: LiteEvent<Cell>;
	OnStateChanged: LiteEvent<OrderState>;

	IsDone(): boolean;
	GetState(): OrderState;
	Do(): void;
	Cancel(): void;
	GetKind(): OrderKind;
	GetCells(): Cell[];
	GetGoals(): Cell[];
}
