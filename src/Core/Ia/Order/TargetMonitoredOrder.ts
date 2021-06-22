import { TimeTimer } from './../../Utils/Timer/TimeTimer';
import { BasicOrder } from './BasicOrder';
import { TargetRoad, TargetRoadProvider } from './TargetRoadProvider';
import { Tank } from './../../Items/Unit/Tank';
import { OrderState } from './OrderState';
import { Cell } from '../../Items/Cell/Cell';
import { TargetCellOrder } from './Composite/TargetCellOrder';
import { ParentOrder } from './ParentOrder';
import { IdleOrder } from './IdleOrder';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';
import { AliveItem } from '../../Items/AliveItem';
import { Relationship } from '../../Items/Identity';

export class TargetMonitoredOrder extends ParentOrder {
	private _vehicleCellChanged: boolean;
	private _idleTimer: TimeTimer;
	constructor(protected Destination: Cell, protected Tank: Tank) {
		super();
		this.SetCurrentOrder(new IdleOrder());
		this._vehicleCellChanged = true;
		this.Tank.OnCellChanged.On(this.VehicleCellChange.bind(this));
		this.SetState(OrderState.Pending);
		this._idleTimer = new TimeTimer(Math.random() * 1000);
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
		const enemy = this.GetTarget();
		if (enemy) {
			this.Tank.SetMainTarget(enemy);
		}

		const targetRoad = new TargetRoadProvider(this.Tank, this.Destination).GetTargetRoad();
		if (targetRoad && 0 < targetRoad.Road.length) {
			if (this.HasTarget(targetRoad.Target)) {
				this.SetCurrentOrder(new TargetCellOrder(this.Tank, targetRoad.Target, this.GetChildOrder(targetRoad)));
			} else {
				this.SetCurrentOrder(new BasicOrder(this.Tank, targetRoad.Road));
			}
			this.OnPathFound.Invoke(this, targetRoad.Road);
		} else {
			this.SetCurrentOrder(new IdleOrder());
		}
	}

	private GetTarget(): AliveItem {
		if (this.Destination.HasOccupier()) {
			const t = (this.Destination.GetOccupier() as any) as AliveItem;
			if (t.GetRelation(this.Tank.Identity) !== Relationship.Ally) {
				return t;
			}
		}

		if (this.Destination.GetField() instanceof AliveItem) {
			const shield = (this.Destination.GetField() as any) as AliveItem;
			if (shield.GetRelation(this.Tank.Identity) !== Relationship.Ally) {
				return shield;
			}
		}
		return null;
	}

	private GetChildOrder(targetCell: TargetRoad) {
		if (targetCell.Road.length === 0) {
			return new IdleOrder();
		} else {
			return new BasicOrder(this.Tank, targetCell.Road);
		}
	}

	private HasTarget(cell: Cell): boolean {
		return cell.IsBlocked() && TypeTranslator.GetRelation(cell, this.Tank.Identity) !== Relationship.Ally;
	}

	private IsIdle(): boolean {
		return (
			this.CurrentOrder instanceof IdleOrder ||
			(this.CurrentOrder instanceof TargetCellOrder && (this.CurrentOrder as TargetCellOrder).IsIdle())
		);
	}

	Update(): void {
		if (this.Tank.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
			return;
		}

		if (this._vehicleCellChanged || (this.IsIdle() && this._idleTimer.IsElapsed())) {
			this.ResetIdleTimer();
			//because of idle it does loop a lot here
			//can be updated?
			this._vehicleCellChanged = false;
			this.ClearChild();
			this.Reset();
		}

		if (this.CurrentOrder.GetState() === OrderState.Passed || this.CurrentOrder.GetState() === OrderState.Cancel) {
			this.ClearChild();
		} else {
			this.CurrentOrder.Update();
		}
	}

	private ResetIdleTimer() {
		if (this.IsIdle) {
			this._idleTimer = new TimeTimer(Math.random() * 1000);
		}
	}
}
