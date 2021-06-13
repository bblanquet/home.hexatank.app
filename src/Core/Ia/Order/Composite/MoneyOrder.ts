import { MonitoredOrder } from '../MonitoredOrder';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Cell } from '../../../Items/Cell/Cell';
import { FarmField } from '../../../Items/Cell/Field/Bonus/FarmField';
import { ParentOrder } from '../ParentOrder';

export class MoneyOrder extends ParentOrder {
	constructor(private _v: Vehicle) {
		super();
	}

	public GetPath(): Cell[] {
		if (this.CurrentOrder) {
			return this.CurrentOrder.GetPath();
		} else {
			return [];
		}
	}

	Update(): void {
		if (this.CurrentOrder) {
			if (this.CurrentOrder.IsDone()) {
				this.TryToFindMoneyField();
			} else {
				this.CurrentOrder.Update();
			}
		} else {
			this.TryToFindMoneyField();
		}
	}

	public Cancel(): void {
		super.Cancel();
		if (this.CurrentOrder) {
			this.CurrentOrder.Cancel();
		}
	}

	public HasFullMoneyCell(range: number): boolean {
		return this._v
			.GetCurrentCell()
			.GetRange(range)
			.map((c) => c as Cell)
			.some((c) => c.GetField() instanceof FarmField && (<FarmField>c.GetField()).IsFull() && !c.IsBlocked());
	}

	public GetFirstFullMoneyCell(range: number): Cell {
		return this._v
			.GetCurrentCell()
			.GetRange(range)
			.map((c) => c as Cell)
			.filter(
				(c) => c.GetField() instanceof FarmField && (<FarmField>c.GetField()).IsFull() && !c.IsBlocked()
			)[0];
	}

	public TryToFindMoneyField(): void {
		for (let i = 1; i < 6; i++) {
			if (this.HasFullMoneyCell(i)) {
				const cell = this.GetFirstFullMoneyCell(i);
				this.SetCurrentOrder(new MonitoredOrder(cell, this._v));
				return;
			}
		}
	}
}
