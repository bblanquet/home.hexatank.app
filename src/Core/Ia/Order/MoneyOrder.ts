import { Order } from './Order';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { SimpleOrder } from './SimpleOrder';
import { Cell } from '../../Items/Cell/Cell';
import { MoneyField } from '../../Items/Cell/Field/MoneyField';

export class MoneyOrder extends Order {
	private _currentOrder: SimpleOrder;

	constructor(private _v: Vehicle) {
		super();
	}

	Do(): void {
		if (this._currentOrder) {
			if (this._currentOrder.IsDone()) {
				this.TryToGetMoneyField();
			} else {
				this._currentOrder.Do();
			}
		} else {
			this.TryToGetMoneyField();
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
			.some((c) => c.GetField() instanceof MoneyField && (<MoneyField>c.GetField()).IsFull());
	}

	public GetFirstFullMoneyCell(range: number): Cell {
		return this._v
			.GetCurrentCell()
			.GetSpecificRange(range)
			.map((c) => c as Cell)
			.filter((c) => c.GetField() instanceof MoneyField && (<MoneyField>c.GetField()).IsFull())[0];
	}

	public TryToGetMoneyField(): void {
		for (let i = 1; i < 3; i++) {
			if (this.HasFullMoneyCell(i)) {
				const cell = this.GetFirstFullMoneyCell(i);
				this._currentOrder = new SimpleOrder(cell, this._v);
				return;
			}
		}
	}
}
