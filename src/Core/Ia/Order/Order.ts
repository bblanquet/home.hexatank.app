import { Cell } from '../../Items/Cell/Cell';
import { IOrder } from './IOrder';
import { OrderKind } from './OrderKind';
import { OrderState } from './OrderState';

export abstract class Order implements IOrder {
	protected State: OrderState;
	constructor() {
		this.State = OrderState.None;
	}
	abstract GetKind(): OrderKind;
	abstract GetDestination(): Cell[];

	public Reset(): void {
		this.State = OrderState.None;
	}

	public IsDone(): boolean {
		return this.State === OrderState.Failed || this.State === OrderState.Passed || this.State === OrderState.Cancel;
	}

	public GetState(): OrderState {
		return this.State;
	}

	public Cancel(): void {
		this.State = OrderState.Cancel;
	}

	abstract Do(): void;
}
