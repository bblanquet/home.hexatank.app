import { Cell } from '../../../Items/Cell/Cell';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Order } from '../Order';
import { OrderKind } from '../OrderKind';
import { OrderState } from '../OrderState';
import { SimpleOrder } from './../SimpleOrder';

export class PersistentOrder extends Order {
	private _currentOrder: SimpleOrder;

	constructor(protected OriginalDest: Cell, private _v: Vehicle) {
		super();
		this._currentOrder = new SimpleOrder(this.OriginalDest, this._v);
		this._v.OnCellChanged.On((src: any, c: Cell) => this.OnCellChanged());
		this._currentOrder.OnPathCreated.On((src: any, cells: Cell[]) => {
			this.OnPathCreated.Invoke(this, cells);
		});
		this._currentOrder.OnNextCell.On((src: any, cell: Cell) => {
			this.OnNextCell.Invoke(this, cell);
		});
	}

	public GetKind(): OrderKind {
		return OrderKind.Persistent;
	}
	public GetCells(): Cell[] {
		return this._currentOrder.GetCells();
	}

	private OnCellChanged(): void {
		if (this._v.GetCurrentCell() !== this.OriginalDest) {
			this._currentOrder.Cancel();
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
				this.SetState(OrderState.Passed);
				this._v.OnCellChanged.Off((src: any, c: Cell) => this.OnCellChanged());
			}
		} else {
			this._currentOrder.Do();
		}
	}
}
