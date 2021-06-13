import { Cell } from '../../Items/Cell/Cell';
import { Order } from './Order';
import { OrderKind } from './OrderKind';

export abstract class ParentOrder extends Order {
	protected CurrentOrder: Order;
	constructor() {
		super();
	}

	protected SetCurrentOrder(order: Order): void {
		this.Clear();
		this.CurrentOrder = order;
		this.CurrentOrder.OnPathFound.On(this.InvokePathCreated.bind(this));
		this.CurrentOrder.OnNextStep.On(this.InvokeNextStep.bind(this));
	}

	protected Clear() {
		if (this.CurrentOrder) {
			this.CurrentOrder.OnPathFound.Off(this.InvokePathCreated.bind(this));
			this.CurrentOrder.OnNextStep.Off(this.InvokeNextStep.bind(this));
		}
	}

	protected InvokePathCreated(src: any, cells: Cell[]): void {
		this.OnPathFound.Invoke(this, cells);
	}

	protected InvokeNextStep(src: any, cell: Cell): void {
		this.OnNextStep.Invoke(this, cell);
	}

	GetKind(): OrderKind {
		return this.CurrentOrder.GetKind();
	}
	GetPath(): Cell[] {
		return this.CurrentOrder.GetPath();
	}

	abstract Update(): void;
}
