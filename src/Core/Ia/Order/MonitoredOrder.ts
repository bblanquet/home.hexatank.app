import { RoadProvider } from './RoadProvider';
import { OrderState } from './OrderState';
import { BasicOrder } from './BasicOrder';
import { Cell } from '../../Items/Cell/Cell';
import { ParentOrder } from './ParentOrder';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { IdleOrder } from './IdleOrder';
import { TimeTimer } from '../../Utils/Timer/TimeTimer';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';

export class MonitoredOrder extends ParentOrder {
	private _vehicleCellChanged: boolean;
	private _idleTimer: TimeTimer;

	constructor(protected Destination: Cell, protected Vehicle: Vehicle) {
		super();
		this.SetState(OrderState.Pending);
		this.SetCurrentOrder(new IdleOrder());
		this._vehicleCellChanged = true;
		this.Vehicle.OnCellChanged.On(this.VehicleCellChange.bind(this));
		this._idleTimer = new TimeTimer(Math.random() * 1000);
	}

	private VehicleCellChange(src: any, cell: Cell): void {
		this._vehicleCellChanged = true;
	}

	public Reset(): void {
		if (this.Vehicle.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
		} else {
			const nextRoad = new RoadProvider(this.Vehicle, this.Destination).GetBestRoad();
			const road = this.CurrentOrder.GetPath();
			if (this.HasNext(nextRoad)) {
				if (this.IsNextBetter(nextRoad)) {
					this.SetCurrentOrder(new BasicOrder(this.Vehicle, nextRoad));
					this.OnPathFound.Invoke(this, nextRoad);
				}
			} else {
				this.SetCurrentOrder(new IdleOrder());
			}
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
