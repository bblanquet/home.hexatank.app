import { Cell } from '../../Items/Cell/Cell';
import { OrderKind } from './OrderKind';
import { OrderState } from './OrderState';

export interface IOrder {
	IsDone(): boolean;
	GetState(): OrderState;
	Do(): void;
	Cancel(): void;
	GetKind(): OrderKind;
	GetDestination(): Cell[];
}
