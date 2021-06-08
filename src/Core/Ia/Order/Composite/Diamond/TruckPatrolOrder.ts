import { OrderState } from '../../OrderState';
import { HqFieldOrder } from './HqFieldOrder';
import { DiamondFieldOrder } from './DiamondFieldOrder';
import { Truck } from '../../../../Items/Unit/Truck';
import { DiamondField } from '../../../../Items/Cell/Field/DiamondField';
import { ParentOrder } from '../../ParentOrder';

export class TruckPatrolOrder extends ParentOrder {
	constructor(private truck: Truck, private _hqOrder: HqFieldOrder, private _diamondFieldOrder: DiamondFieldOrder) {
		super();
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
			const order = this._diamondFieldOrder.GetOrder();
			if (order) {
				this.SetCurrentOrder(order);
			}
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
		const nextOrder = this._diamondFieldOrder.IsOrder(this.CurrentOrder)
			? this._hqOrder.GetOrder()
			: this._diamondFieldOrder.GetOrder();
		if (nextOrder) {
			this.SetCurrentOrder(nextOrder);
		}
	}

	public Reset(): void {
		const orderMaker = this._diamondFieldOrder.IsOrder(this.CurrentOrder) ? this._diamondFieldOrder : this._hqOrder;
		const order = orderMaker.GetOrder();
		if (order) {
			this.SetCurrentOrder(order);
		}
	}
	private IsLoadingDiamonds() {
		return this.truck.GetCurrentCell().GetField() instanceof DiamondField && !this.truck.IsLoaded();
	}
}
