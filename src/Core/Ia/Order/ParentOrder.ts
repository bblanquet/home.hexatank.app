import { Cell } from '../../Items/Cell/Cell';
import { Order } from './Order';
import { OrderKind } from './OrderKind';

export abstract class ParentOrder extends Order {
	protected CurrentOrder: Order;
	constructor() {
		super();
	}

	protected SetCurrentOrder(order: Order): void {
		this.ClearChild();
		this.CurrentOrder = order;
		this.CurrentOrder.OnPathFound.On(this.HandlePathFound.bind(this));
		this.CurrentOrder.OnNextStep.On(this.HandleNextStep.bind(this));
	}

	protected ClearChild() {
		if (this.CurrentOrder) {
			this.CurrentOrder.OnPathFound.Off(this.HandlePathFound.bind(this));
			this.CurrentOrder.OnNextStep.Off(this.HandleNextStep.bind(this));
		}
	}

	protected HandlePathFound(src: any, cells: Cell[]): void {
		this.OnPathFound.Invoke(this, cells);
	}

	protected HandleNextStep(src: any, cell: Cell): void {
		this.OnNextStep.Invoke(this, cell);
	}

	GetKind(): OrderKind {
		return this.CurrentOrder.GetKind();
	}
	GetPath(): Cell[] {
		if (this.CurrentOrder) {
			return this.CurrentOrder.GetPath();
		} else {
			return [];
		}
	}

	abstract Update(): void;
}
