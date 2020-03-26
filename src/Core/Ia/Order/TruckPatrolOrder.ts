import { Order } from './Order';
import { OrderState } from './OrderState';
import { HqFieldOrder } from './HqFieldOrder';
import { DiamondFieldOrder } from './DiamondFieldOrder';
import { SimpleOrder } from './SimpleOrder';
import { Truck } from '../../Items/Unit/Truck';
import { DiamondField } from '../../Items/Cell/Field/DiamondField';

export class TruckPatrolOrder extends Order {
	private _currentOrder: SimpleOrder;

	constructor(private truck: Truck, private _hqOrder: HqFieldOrder, private _diamondFieldOrder: DiamondFieldOrder) {
		super();
	}

	public Cancel(): void {
		if (this._currentOrder) {
			this._currentOrder.Cancel();
		}
	}

	Do(): void {
		if (this.State === OrderState.None) {
			this._currentOrder = this._diamondFieldOrder;
			this.State = OrderState.Pending;
			this._currentOrder.Reset();
		}

		if (this._currentOrder.IsDone()) {
			const field = this.truck.GetCurrentCell().GetField();
			if (field.constructor.name === DiamondField.name && !this.truck.IsLoaded()) {
				//wait
				return;
			}

			if (this._currentOrder.GetState() === OrderState.Failed) {
				//reset
			} else if (this._currentOrder === this._diamondFieldOrder) {
				this._currentOrder = this._hqOrder;
			} else {
				this._currentOrder = this._diamondFieldOrder;
			}
			this._currentOrder.Reset();
		} else {
			this._currentOrder.Do();
		}
	}
}
