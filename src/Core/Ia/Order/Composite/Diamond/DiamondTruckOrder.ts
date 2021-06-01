import { MonitoredOrder } from './../../MonitoredOrder';
import { Order } from '../../Order';
import { OrderState } from '../../OrderState';
import { HqFieldOrder } from './HqFieldOrder';
import { DiamondFieldOrder } from './DiamondFieldOrder';
import { Truck } from '../../../../Items/Unit/Truck';
import { DiamondField } from '../../../../Items/Cell/Field/DiamondField';
import { Cell } from '../../../../Items/Cell/Cell';
import { OrderKind } from '../../OrderKind';

export class DiamondTruckOrder extends Order {
	private _currentOrder: MonitoredOrder;

	constructor(private truck: Truck, private _hqOrder: HqFieldOrder, private _diamondFieldOrder: DiamondFieldOrder) {
		super();
	}

	public GetArrivals(): Cell[] {
		return this._hqOrder.GetOrder().GetArrivals().concat(this._diamondFieldOrder.GetOrder().GetArrivals());
	}

	public Cancel(): void {
		super.Cancel();
		if (this._currentOrder) {
			this.Clear();
			this._currentOrder.Cancel();
		}
	}

	public GetKind(): OrderKind {
		return OrderKind.Truck;
	}
	public GetCells(): Cell[] {
		return this._currentOrder.GetCells();
	}

	private SetCurrentOrder(order: MonitoredOrder): void {
		this.Clear();
		this._currentOrder = order;
		this._currentOrder.OnPathCreated.On(this.InvokePathCreated.bind(this));
		this._currentOrder.OnNextCell.On(this.InvokeNextCell.bind(this));
	}

	private Clear() {
		if (this._currentOrder) {
			this._currentOrder.OnPathCreated.Off(this.InvokePathCreated.bind(this));
			this._currentOrder.OnNextCell.Off(this.InvokeNextCell.bind(this));
		}
	}

	private InvokePathCreated(src: any, cells: Cell[]): void {
		this.OnPathCreated.Invoke(this, cells);
	}

	private InvokeNextCell(src: any, cell: Cell): void {
		this.OnNextCell.Invoke(this, cell);
	}

	Do(): void {
		if (this.GetState() === OrderState.None) {
			this._currentOrder = this._diamondFieldOrder.GetOrder();
			this.SetState(OrderState.Pending);
			this._currentOrder.Reset();
		}

		if (this._currentOrder.IsDone()) {
			if (this.IsLoadingDiamonds()) {
				return;
			}
			if (this._currentOrder.GetState() === OrderState.Passed) {
				this.SwitchOrder();
			} else if (this._currentOrder.GetState() === OrderState.Failed) {
				this.Reset();
			}
		} else {
			this._currentOrder.Do();
		}
	}

	private SwitchOrder(): void {
		const nextOrder = this._diamondFieldOrder.IsOrder(this._currentOrder)
			? this._hqOrder.GetOrder()
			: this._diamondFieldOrder.GetOrder();
		this.SetCurrentOrder(nextOrder);
	}

	public Reset(): void {
		const order = this._diamondFieldOrder.IsOrder(this._currentOrder) ? this._diamondFieldOrder : this._hqOrder;
		this.SetCurrentOrder(order.GetOrder());
	}
	private IsLoadingDiamonds() {
		return this.truck.GetCurrentCell().GetField() instanceof DiamondField && !this.truck.IsLoaded();
	}
}
