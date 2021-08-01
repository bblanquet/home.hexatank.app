import { IdleOrder } from './../IdleOrder';
import { BasicItem } from '../../../Items/BasicItem';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { OrderState } from '../OrderState';
import { ParentOrder } from '../ParentOrder';
import { Order } from '../Order';
import { TypeTranslator } from '../../../Items/Cell/Field/TypeTranslator';

export class TargetCellOrder extends ParentOrder {
	private _targetUi: BasicItem;

	constructor(private _tank: Tank, private _cell: Cell, order: Order) {
		super();
		this.SetCurrentOrder(order);
	}

	public IsIdle(): boolean {
		return this.CurrentOrder instanceof IdleOrder;
	}

	public Update(): void {
		const target = TypeTranslator.GetAliveItem(this._cell, this._tank.Identity);
		if (target && !this.CurrentOrder.IsDone()) {
			this._tank.SetMainTarget(target);
			this.CurrentOrder.Update();
		} else {
			this.SetState(OrderState.Passed);
		}
	}

	public Cancel(): void {
		super.Cancel();
		this.CurrentOrder.Cancel();
		this._targetUi.Destroy();
	}
}
