import { TimeTimer } from './../../../Utils/Timer/TimeTimer';
import { BasicOrder } from './BasicOrder';
import { TargetRoad, TargetRoadProvider } from './TargetRoadProvider';
import { Tank } from './../../Items/Unit/Tank';
import { OrderState } from './OrderState';
import { Cell } from '../../Items/Cell/Cell';
import { TargetCellOrder } from './Composite/TargetCellOrder';
import { ParentOrder } from './ParentOrder';
import { IdleOrder } from './IdleOrder';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';
import { Relationship } from '../../Items/Identity';
import { isEqual } from 'lodash';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';

export class TargetMonitoredOrder extends ParentOrder {
	private _vehicleCellChanged: boolean;
	private _idleTimer: TimeTimer;
	private _currentPath: Cell[] = null;

	constructor(protected Destination: Cell, protected Tank: Tank) {
		super();
		ErrorHandler.ThrowNull(Destination);
		this.SetCurrentOrder(new IdleOrder());
		this._vehicleCellChanged = true;
		this.Tank.OnCellChanged.On(this.VehicleCellChange.bind(this));
		this.SetState(OrderState.Pending);
		this._idleTimer = new TimeTimer(Math.random() * 1000);
	}

	private VehicleCellChange(src: any, cell: Cell): void {
		this._vehicleCellChanged = true;
	}

	public FetchPath(): void {
		if (this.Tank.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
		} else {
			this.UpdateOrder();
		}
	}

	private UpdateOrder() {
		let next: Cell[] = null;
		const nextRoad = new TargetRoadProvider(this.Tank, this.Destination).GetTargetRoad();
		if (this.HasNext(nextRoad)) {
			if (this.IsNextBetter(nextRoad)) {
				next = nextRoad.Road;
				if (this.HasTarget(nextRoad.Target)) {
					this.SetCurrentOrder(
						new TargetCellOrder(this.Tank, nextRoad.Target, new BasicOrder(this.Tank, nextRoad.Road))
					);
				} else {
					this.SetCurrentOrder(new BasicOrder(this.Tank, nextRoad.Road));
				}
			}
		} else if (!this.HasAccess(this.CurrentOrder.GetPath())) {
			next = [];
			this.SetCurrentOrder(new IdleOrder());
		}
		if (!isNullOrUndefined(next) && !isEqual(next, this._currentPath)) {
			this._currentPath = next;
			this.OnPathFound.Invoke(this, this._currentPath);
		}
	}

	private HasNext(nextRoad: TargetRoad) {
		return nextRoad && 0 < nextRoad.Road.length;
	}

	private IsNextBetter(nextRoad: TargetRoad): boolean {
		if (this.CurrentOrder instanceof IdleOrder) {
			return true;
		}
		const road = this.CurrentOrder.GetPath();
		if (road.length === 0) {
			return true;
		}

		return !this.HasAccess(road) || nextRoad.Road.length + 1 < road.length;
	}
	private HasAccess(path: Cell[]): boolean {
		return path.every((p) => TypeTranslator.IsAccessible(p, this.Tank));
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
			this._vehicleCellChanged = false;
			this.FetchPath();
		}

		if (this.CurrentOrder.GetState() === OrderState.Passed) {
			this.FetchPath();
		} else if (this.CurrentOrder.GetState() === OrderState.Cancel) {
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
