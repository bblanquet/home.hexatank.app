import { SmartPreciseOrder } from './SmartPreciseOrder';
import { Order } from './Order';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Cell } from '../../Items/Cell/Cell';
import { MoneyField } from '../../Items/Cell/Field/MoneyField';

export class MoneyOrder extends Order {
	private _currentOrder: SmartPreciseOrder;

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
			.some((c) => c.GetField() instanceof MoneyField && (<MoneyField>c.GetField()).IsFull() && !c.IsBlocked());
	}

	public GetFirstFullMoneyCell(range: number): Cell {
		return this._v
			.GetCurrentCell()
			.GetSpecificRange(range)
			.map((c) => c as Cell)
			.filter(
				(c) => c.GetField() instanceof MoneyField && (<MoneyField>c.GetField()).IsFull() && !c.IsBlocked()
			)[0];
	}

	public TryToGetMoneyField(): void {
		for (let i = 1; i < 6; i++) {
			if (this.HasFullMoneyCell(i)) {
				const cell = this.GetFirstFullMoneyCell(i);
				this._currentOrder = new SmartPreciseOrder(cell, this._v);
				return;
			}
		}
	}
}
