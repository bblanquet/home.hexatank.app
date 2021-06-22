import { RoadProvider } from './RoadProvider';
import { OrderState } from './OrderState';
import { BasicOrder } from './BasicOrder';
import { Cell } from '../../Items/Cell/Cell';
import { ParentOrder } from './ParentOrder';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { IdleOrder } from './IdleOrder';
import { TimeTimer } from '../../Utils/Timer/TimeTimer';

export class MonitoredOrder extends ParentOrder {
	private _vehicleCellChanged: boolean;
	private _idleTimer: TimeTimer;

	constructor(protected Destination: Cell, protected Vehicle: Vehicle) {
		super();
		this.SetState(OrderState.Pending);
		this.SetCurrentOrder(new IdleOrder());
		this._vehicleCellChanged = true;
		this.Vehicle.OnCellChanged.On(this.VehicleCellChange.bind(this));
		this._idleTimer = new TimeTimer(1000);
	}

	private VehicleCellChange(src: any, cell: Cell): void {
		this._vehicleCellChanged = true;
	}

	public Reset(): void {
		if (this.Vehicle.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
		} else {
			const road = new RoadProvider(this.Vehicle, this.Destination).GetBestRoad();
			if (road && 0 < road.length) {
				this.SetCurrentOrder(new BasicOrder(this.Vehicle, road));
				this.OnPathFound.Invoke(this, road);
			} else {
				this.SetCurrentOrder(new IdleOrder());
			}
		}
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
}
