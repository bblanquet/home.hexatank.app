import { BasicOrder } from './BasicOrder';
import { TargetRoad, TargetRoadProvider } from './TargetRoadProvider';
import { Tank } from './../../Items/Unit/Tank';
import { OrderState } from './OrderState';
import { Cell } from '../../Items/Cell/Cell';
import { TargetCellOrder } from './Composite/TargetCellOrder';
import { ParentOrder } from './ParentOrder';
import { IdleOrder } from './IdleOrder';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';

export class TargetMonitoredOrder extends ParentOrder {
	private _vehicleCellChanged: boolean;
	constructor(protected Destination: Cell, protected Tank: Tank) {
		super();
		this.SetCurrentOrder(new IdleOrder());
		this._vehicleCellChanged = true;
		this.Tank.OnCellChanged.On(this.VehicleCellChange.bind(this));
		this.SetState(OrderState.Pending);
	}

	private VehicleCellChange(src: any, cell: Cell): void {
		this._vehicleCellChanged = true;
	}

	public Reset(): void {
		if (this.Tank.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
		} else {
			this.UpdateOrder();
		}
	}

	private UpdateOrder() {
		const targetRoad = new TargetRoadProvider(this.Tank, this.Destination).GetTargetRoad();
		if (targetRoad) {
			if (this.HasTarget(targetRoad.Target)) {
				this.SetCurrentOrder(new TargetCellOrder(this.Tank, targetRoad.Target, this.GetChildOrder(targetRoad)));
			} else {
				this.SetCurrentOrder(new BasicOrder(this.Tank, targetRoad.Road));
			}
			this.OnPathFound.Invoke(this, targetRoad.Road);
		} else {
			this.Clear();
			this.SetCurrentOrder(new IdleOrder());
			this.SetState(OrderState.Failed);
		}
	}

	private GetChildOrder(targetCell: TargetRoad) {
		if (targetCell.Road.length === 0) {
			return new IdleOrder();
		} else {
			return new BasicOrder(this.Tank, targetCell.Road);
		}
	}

	private HasTarget(cell: Cell): boolean {
		return cell.IsBlocked() && TypeTranslator.HasEnemy(cell, this.Tank.Identity);
	}

	private IsIdle(): boolean {
		return this.CurrentOrder instanceof TargetCellOrder && (this.CurrentOrder as TargetCellOrder).IsIdle();
	}

	Update(): void {
		if (this.Tank.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
			return;
		}

		if (this._vehicleCellChanged || this.IsIdle()) {
			this._vehicleCellChanged = false;
			this.Clear();
			this.Reset();
		}

		if (this.CurrentOrder.GetState() === OrderState.Failed) {
			this.Reset();
		} else if (
			this.CurrentOrder.GetState() === OrderState.Passed ||
			this.CurrentOrder.GetState() === OrderState.Cancel
		) {
			this.Clear();
		} else {
			this.CurrentOrder.Update();
		}
	}
}
