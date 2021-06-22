import { OrderState } from '../../OrderState';
import { HqFieldOrder } from './HqFieldOrder';
import { DiamondFieldOrder } from './DiamondFieldOrder';
import { Truck } from '../../../../Items/Unit/Truck';
import { DiamondField } from '../../../../Items/Cell/Field/DiamondField';
import { ParentOrder } from '../../ParentOrder';
import { TimeTimer } from '../../../../Utils/Timer/TimeTimer';
import { IOrderGiver } from './IOrderGiver';

export class TruckPatrolOrder extends ParentOrder {
	private _idleTimer: TimeTimer;
	private _isIdle: boolean;
	constructor(private truck: Truck, private _hqOrder: HqFieldOrder, private _diamondFieldOrder: DiamondFieldOrder) {
		super();
		this._idleTimer = new TimeTimer(1000);
		this._isIdle = false;
		this.SetState(OrderState.Pending);
	}

	public Cancel(): void {
		super.Cancel();
		if (this.CurrentOrder) {
			this.Clear();
			this.CurrentOrder.Cancel();
		}
	}

	Update(): void {
		if (!this.CurrentOrder) {
			this.TryToSetNextOrder(this._diamondFieldOrder);
		}

		if (this.CurrentOrder && this.CurrentOrder.IsDone()) {
			if (this.IsLoadingDiamonds()) {
				return;
			}
			if (this.CurrentOrder.GetState() === OrderState.Passed) {
				this.SwitchOrder();
			} else if (this.CurrentOrder.GetState() === OrderState.Failed) {
				this.Reset();
			}
		} else if (this.CurrentOrder) {
			this.CurrentOrder.Update();
		}
	}

	private SwitchOrder(): void {
		const orderGiver = this._diamondFieldOrder.IsOrder(this.CurrentOrder) ? this._hqOrder : this._diamondFieldOrder;
		this.TryToSetNextOrder(orderGiver);
	}

	private TryToSetNextOrder(order: IOrderGiver) {
		if (!this._isIdle || (this._isIdle && this._idleTimer.IsElapsed())) {
			const nextOrder = order.GetOrder();
			this._isIdle = false;

			if (nextOrder) {
				this.SetCurrentOrder(nextOrder);
			} else {
				this._isIdle = true;
				this._idleTimer.Reset();
			}
		}
	}

	public Reset(): void {
		const orderGiver = this._diamondFieldOrder.IsOrder(this.CurrentOrder) ? this._diamondFieldOrder : this._hqOrder;
		this.TryToSetNextOrder(orderGiver);
	}
	private IsLoadingDiamonds() {
		return this.truck.GetCurrentCell().GetField() instanceof DiamondField && !this.truck.IsLoaded();
	}
}
