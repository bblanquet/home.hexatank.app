import { RoadProvider } from './../RoadProvider';
import { IdleOrder } from './../IdleOrder';
import { BasicOrder } from './../BasicOrder';
import { ZKind } from '../../../Items/ZKind';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { BasicItem } from '../../../Items/BasicItem';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { OrderState } from '../OrderState';
import { AliveItem } from '../../../Items/AliveItem';
import { ParentOrder } from '../ParentOrder';
import { Order } from '../Order';
import { Relationship } from '../../../Items/Identity';

export class TargetCellOrder extends ParentOrder {
	private _targetUi: BasicItem;

	constructor(private _tank: Tank, private _targetCell: Cell, order: Order) {
		super();
		this._tank.SetMainTarget(this.GetTarget());
		this.SetCurrentOrder(order);
	}

	public IsIdle(): boolean {
		return this.CurrentOrder instanceof IdleOrder;
	}

	public GetTarget(): AliveItem {
		if (this._targetCell.HasOccupier()) {
			const t = this._targetCell.GetOccupiers()[0];
			if (t.GetRelation(this._tank.Identity) !== Relationship.Ally) {
				return t;
			}
		}

		if (this._targetCell.GetField() instanceof AliveItem) {
			const shield = (this._targetCell.GetField() as any) as AliveItem;
			if (shield.GetRelation(this._tank.Identity) !== Relationship.Ally) {
				return shield;
			}
		}
		return null;
	}

	public Update(): void {
		if (!this.GetTarget()) {
			this.SetState(OrderState.Passed);
			return;
		}

		if (!this.CurrentOrder.IsDone()) {
			this.CurrentOrder.Update();
		}
	}

	public Cancel(): void {
		super.Cancel();
		this.CurrentOrder.Cancel();
		this._targetUi.Destroy();
	}
}
