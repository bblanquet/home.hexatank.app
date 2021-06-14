import { Cell } from '../../Items/Cell/Cell';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { OrderKind } from './OrderKind';
import { OrderState } from './OrderState';

export interface IOrder {
	OnPathFound: LiteEvent<Cell[]>;
	OnNextStep: LiteEvent<Cell>;
	OnStateChanged: LiteEvent<OrderState>;

	IsDone(): boolean;
	GetState(): OrderState;
	Update(): void;
	Cancel(): void;
	GetKind(): OrderKind;
	GetPath(): Cell[];
	Clear(): void;
}
