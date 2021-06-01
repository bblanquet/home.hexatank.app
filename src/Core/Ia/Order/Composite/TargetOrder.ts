import { ZKind } from '../../../Items/ZKind';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { AliveItem } from '../../../Items/AliveItem';
import { BasicItem } from '../../../Items/BasicItem';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { OrderState } from '../OrderState';
import { MonitoredOrder } from '../MonitoredOrder';
import { ParentOrder } from '../ParentOrder';

export class TargetOrder extends ParentOrder {
	private _targetUi: BasicItem;
	private _currentcell: Cell;

	constructor(private _v: Tank, private _target: AliveItem) {
		super();
		this._v.SetMainTarget(this._target);
	}

	public Update(): void {
		if (this._target !== this._v.GetMainTarget()) {
			this.Cancel();
			return;
		}

		if (this.GetState() === OrderState.None) {
			this._currentcell = this._target.GetCurrentCell();
			this.SetCurrentOrder(new MonitoredOrder(this._currentcell, this._v));
			this.SetState(OrderState.Pending);
			this.ShowUi();
		}

		if (this._target.GetCurrentCell() !== this._currentcell && !this._v.HasNextCell()) {
			this.CurrentOrder.Cancel();
			this._currentcell = this._target.GetCurrentCell();
			this.SetCurrentOrder(new MonitoredOrder(this._currentcell, this._v));
		}

		if (this.CurrentOrder.IsDone()) {
			if (this.CurrentOrder.GetState() !== OrderState.Passed) {
				this.SetCurrentOrder(new MonitoredOrder(this._currentcell, this._v));
			} else {
				this.SetState(OrderState.Passed);
				return;
			}
		} else {
			this.CurrentOrder.Update();
		}
	}

	public Cancel(): void {
		super.Cancel();
		this.CurrentOrder.Cancel();
		this._targetUi.Destroy();
	}

	private ShowUi() {
		this._targetUi = new BasicItem(this._target.GetBoundingBox(), SvgArchive.direction.target, ZKind.Sky);
		this._targetUi.SetVisible(this._v.IsSelected.bind(this._v));
		this._targetUi.SetAlive(
			() => this._v.IsAlive() && this._target.IsAlive() && this._v.GetMainTarget() === this._target
		);
	}
}
