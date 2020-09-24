import { SimpleOrder } from './SimpleOrder';
import { OrderState } from './OrderState';
import { Order } from './Order';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class PersistentOrder extends Order {
	private _currentOrder: SimpleOrder;

	constructor(protected OriginalDest: Cell, private _v: Vehicle) {
		super();
		this._currentOrder = new SimpleOrder(this.OriginalDest, this._v);
		this._v.OnCellChanged.On((src: any, c: Cell) => this.OnCellChanged());
	}

	private OnCellChanged(): void {
		if (this._v.GetCurrentCell() !== this.OriginalDest) {
			this._currentOrder = new SimpleOrder(this.OriginalDest, this._v);
		}
	}

	public Cancel(): void {
		this._v.OnCellChanged.Off((src: any, c: Cell) => this.OnCellChanged());
		if (this._currentOrder) {
			this._currentOrder.Cancel();
		}
	}

	Do(): void {
		if (this._currentOrder.IsDone()) {
			if (this._currentOrder.GetState() === OrderState.Failed) {
				this._currentOrder.Reset();
			} else {
				this._v.OnCellChanged.Off((src: any, c: Cell) => this.OnCellChanged());
			}
		} else {
			this._currentOrder.Do();
		}
	}
}
