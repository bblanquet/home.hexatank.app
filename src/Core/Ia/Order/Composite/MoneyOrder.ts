import { SmartPreciseOrder } from './SmartPreciseOrder';
import { Order } from './../Order';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Cell } from '../../../Items/Cell/Cell';
import { FarmField } from '../../../Items/Cell/Field/Bonus/FarmField';
import { OrderKind } from './../OrderKind';

export class MoneyOrder extends Order {
	private _currentOrder: SmartPreciseOrder;

	constructor(private _v: Vehicle) {
		super();
	}

	public GetKind(): OrderKind {
		return OrderKind.Money;
	}
	public GetCells(): Cell[] {
		if (this._currentOrder) {
			return this._currentOrder.GetCells();
		} else {
			return [];
		}
	}

	Do(): void {
		if (this._currentOrder) {
			if (this._currentOrder.IsDone()) {
				this.TryToFindMoneyField();
			} else {
				this._currentOrder.Do();
			}
		} else {
			this.TryToFindMoneyField();
		}
	}

	public Cancel(): void {
		super.Cancel();
		if (this._currentOrder) {
			this._currentOrder.Cancel();
		}
	}

	public HasFullMoneyCell(range: number): boolean {
		return this._v
			.GetCurrentCell()
			.GetSpecificRange(range)
			.map((c) => c as Cell)
			.some((c) => c.GetField() instanceof FarmField && (<FarmField>c.GetField()).IsFull() && !c.IsBlocked());
	}

	public GetFirstFullMoneyCell(range: number): Cell {
		return this._v
			.GetCurrentCell()
			.GetSpecificRange(range)
			.map((c) => c as Cell)
			.filter(
				(c) => c.GetField() instanceof FarmField && (<FarmField>c.GetField()).IsFull() && !c.IsBlocked()
			)[0];
	}

	public TryToFindMoneyField(): void {
		for (let i = 1; i < 6; i++) {
			if (this.HasFullMoneyCell(i)) {
				const cell = this.GetFirstFullMoneyCell(i);
				this.SetCurrentOrder(new SmartPreciseOrder(cell, this._v));
				return;
			}
		}
	}

	private SetCurrentOrder(order: SmartPreciseOrder): void {
		this.Clear();
		this._currentOrder = order;
		this._currentOrder.OnPathCreated.On(this.InvokePathCreated.bind(this));
		this._currentOrder.OnNextCell.On(this.InvokeNextCell.bind(this));
	}

	private Clear() {
		if (this._currentOrder) {
			this._currentOrder.OnPathCreated.Off(this.InvokePathCreated.bind(this));
			this._currentOrder.OnNextCell.Off(this.InvokeNextCell.bind(this));
		}
	}

	private InvokePathCreated(src: any, cells: Cell[]): void {
		this.OnPathCreated.Invoke(this, cells);
	}

	private InvokeNextCell(src: any, cell: Cell): void {
		this.OnNextCell.Invoke(this, cell);
	}
}
