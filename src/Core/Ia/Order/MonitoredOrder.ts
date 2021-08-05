import { RoadProvider } from './RoadProvider';
import { OrderState } from './OrderState';
import { BasicOrder } from './BasicOrder';
import { Cell } from '../../Items/Cell/Cell';
import { ParentOrder } from './ParentOrder';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { IdleOrder } from './IdleOrder';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { isEqual } from 'lodash';
import { ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';

export class MonitoredOrder extends ParentOrder {
	private _vehicleCellChanged: boolean;
	private _idleTimer: TimeTimer;
	private _currentPath: Cell[] = null;

	constructor(protected Destination: Cell, protected Vehicle: Vehicle) {
		super();
		ErrorHandler.ThrowNullOrUndefined(Destination);
		this.SetState(OrderState.Pending);
		this.SetCurrentOrder(new IdleOrder());
		this._vehicleCellChanged = true;
		this.Vehicle.OnCellChanged.On(this.VehicleCellChange.bind(this));
		this._idleTimer = new TimeTimer(Math.random() * 1000);
	}

	private VehicleCellChange(src: any, cell: Cell): void {
		this._vehicleCellChanged = true;
	}

	public FetchPath(): void {
		let next: Cell[] = null;
		if (this.Vehicle.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
		} else {
			const nextRoad = new RoadProvider(this.Vehicle, this.Destination).GetBestRoad();
			if (this.HasNext(nextRoad)) {
				if (this.IsNextBetter(nextRoad)) {
					this.SetCurrentOrder(new BasicOrder(this.Vehicle, nextRoad));
					next = nextRoad;
				}
			} else if (!this.HasAccess(this.CurrentOrder.GetPath())) {
				next = [];
				this.SetCurrentOrder(new IdleOrder());
			}
		}
		if (!isNullOrUndefined(next) && !isEqual(next, this._currentPath)) {
			this._currentPath = next;
			this.OnPathFound.Invoke(this, this._currentPath);
		}
	}

	private HasNext(nextRoad: Cell[]) {
		return nextRoad && 0 < nextRoad.length;
	}

	private IsNextBetter(nextRoad: Cell[]): boolean {
		if (this.CurrentOrder instanceof IdleOrder) {
			return true;
		}
		const road = this.CurrentOrder.GetPath();
		if (road.length === 0 || this.CurrentOrder.IsDone()) {
			return true;
		}

		return !this.HasAccess(road) || nextRoad.length + 1 < road.length;
	}

	private HasAccess(path: Cell[]): boolean {
		return path.every((p) => TypeTranslator.IsAccessible(p, this.Vehicle));
	}

	private IsIdle(): boolean {
		return this.CurrentOrder instanceof IdleOrder;
	}

	Update(): void {
		if (this.Vehicle.GetCurrentCell() === this.Destination) {
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
