import { Archive } from '../../../Framework/ResourceArchiver';
import { AliveItem } from '../../../Items/AliveItem';
import { BasicItem } from '../../../Items/BasicItem';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { Order } from '../Order';
import { OrderKind } from '../OrderKind';
import { OrderState } from '../OrderState';
import { SimpleOrder } from '../SimpleOrder';

export class TargetOrder extends Order {
	private _targetUi: BasicItem;
	private _currentOrder: SimpleOrder;
	private _currentcell: Cell;

	constructor(private _v: Tank, private _target: AliveItem) {
		super();
		this._v.SetMainTarget(this._target);
	}

	public GetKind(): OrderKind {
		return OrderKind.Target;
	}
	public GetCells(): Cell[] {
		return [ this._target.GetCurrentCell() ];
	}

	public Do(): void {
		if (this._target !== this._v.GetMainTarget()) {
			this.Cancel();
			return;
		}

		if (this.GetState() === OrderState.None) {
			this._currentcell = this._target.GetCurrentCell();
			this._currentOrder = new SimpleOrder(this._currentcell, this._v);
			this.SetState(OrderState.Pending);
			this.ShowUi();
		}

		if (this._target.GetCurrentCell() !== this._currentcell && !this._v.HasNextCell()) {
			this._currentOrder.Cancel();
			this._currentcell = this._target.GetCurrentCell();
			this._currentOrder = new SimpleOrder(this._currentcell, this._v);
		}

		if (this._currentOrder.IsDone()) {
			if (this._currentOrder.GetState() !== OrderState.Passed) {
				this._currentOrder = new SimpleOrder(this._currentcell, this._v);
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
		this._targetUi = new BasicItem(this._target.GetBoundingBox(), Archive.direction.target, 4);
		this._targetUi.SetVisible(this._v.IsSelected.bind(this._v));
		this._targetUi.SetAlive(
			() => this._v.IsAlive() && this._target.IsAlive() && this._v.GetMainTarget() === this._target
		);
	}
}
