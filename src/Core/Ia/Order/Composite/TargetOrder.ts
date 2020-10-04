import { ZKind } from '../../../Items/ZKind';
import { Archive } from '../../../Framework/ResourceArchiver';
import { AliveItem } from '../../../Items/AliveItem';
import { BasicItem } from '../../../Items/BasicItem';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { Order } from '../Order';
import { OrderKind } from '../OrderKind';
import { OrderState } from '../OrderState';
import { SmartSimpleOrder } from './SmartSimpleOrder';

export class TargetOrder extends Order {
	private _targetUi: BasicItem;
	private _currentOrder: SmartSimpleOrder;
	private _currentcell: Cell;

	constructor(private _v: Tank, private _target: AliveItem) {
		super();
		this._v.SetMainTarget(this._target);
	}

	public GetKind(): OrderKind {
		return OrderKind.Target;
	}
	public GetCells(): Cell[] {
		if (this._currentOrder) {
			return this._currentOrder.GetCells();
		} else {
			return [];
		}
	}

	public Do(): void {
		if (this._target !== this._v.GetMainTarget()) {
			this.Cancel();
			return;
		}

		if (this.GetState() === OrderState.None) {
			this._currentcell = this._target.GetCurrentCell();
			this.SetCurrentOrder(new SmartSimpleOrder(this._currentcell, this._v));
			this.SetState(OrderState.Pending);
			this.ShowUi();
		}

		if (this._target.GetCurrentCell() !== this._currentcell && !this._v.HasNextCell()) {
			this._currentOrder.Cancel();
			this._currentcell = this._target.GetCurrentCell();
			this.SetCurrentOrder(new SmartSimpleOrder(this._currentcell, this._v));
		}

		if (this._currentOrder.IsDone()) {
			if (this._currentOrder.GetState() !== OrderState.Passed) {
				this.SetCurrentOrder(new SmartSimpleOrder(this._currentcell, this._v));
			} else {
				this.SetState(OrderState.Passed);
				return;
			}
		} else {
			this._currentOrder.Do();
		}
	}

	public Cancel(): void {
		super.Cancel();
		this._currentOrder.Cancel();
		this._targetUi.Destroy();
		if (!this._target.IsAlive()) {
			this._target.Destroy();
		}
	}

	private ShowUi() {
		this._targetUi = new BasicItem(this._target.GetBoundingBox(), Archive.direction.target, ZKind.Sky);
		this._targetUi.SetVisible(this._v.IsSelected.bind(this._v));
		this._targetUi.SetAlive(
			() => this._v.IsAlive() && this._target.IsAlive() && this._v.GetMainTarget() === this._target
		);
	}

	private SetCurrentOrder(order: SmartSimpleOrder): void {
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
