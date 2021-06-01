import { Cell } from '../../Items/Cell/Cell';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { IOrder } from './IOrder';
import { OrderKind } from './OrderKind';
import { OrderState } from './OrderState';

export abstract class Order implements IOrder {
	private _state: OrderState;
	public OnPathFound: LiteEvent<Cell[]> = new LiteEvent<Cell[]>();
	public OnNextStep: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnStateChanged: LiteEvent<OrderState> = new LiteEvent<OrderState>();
	constructor() {
		this._state = OrderState.None;
	}

	abstract GetKind(): OrderKind;
	abstract GetCells(): Cell[];
	abstract GetArrivals(): Cell[];

	public Reset(): void {
		this._state = OrderState.None;
	}

	public IsDone(): boolean {
		return (
			this.GetState() === OrderState.Failed ||
			this.GetState() === OrderState.Passed ||
			this.GetState() === OrderState.Cancel
		);
	}

	public GetState(): OrderState {
		return this._state;
	}

	public Cancel(): void {
		this.SetState(OrderState.Cancel);
	}

	public SetState(state: OrderState): void {
		const previousState = this._state;
		this._state = state;
		if (previousState !== state) {
			this.OnStateChanged.Invoke(this, this._state);
		}
	}

	abstract Update(): void;
}
