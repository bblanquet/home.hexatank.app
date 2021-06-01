import { ShieldField } from './../../../Items/Cell/Field/Bonus/ShieldField';
import { ZKind } from '../../../Items/ZKind';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { BasicItem } from '../../../Items/BasicItem';
import { Cell } from '../../../Items/Cell/Cell';
import { Tank } from '../../../Items/Unit/Tank';
import { Order } from '../Order';
import { OrderKind } from '../OrderKind';
import { OrderState } from '../OrderState';
import { MonitoredOrder } from '../MonitoredOrder';
import { AliveItem } from '../../../Items/AliveItem';

export class TargetCellOrder extends Order {
	private _targetUi: BasicItem;
	private _currentOrder: MonitoredOrder;
	private _currentcell: Cell;

	constructor(private _v: Tank, private _targetCell: Cell) {
		super();
		this._v.SetMainTarget(this.GetTarget());
	}

	public GetTarget(): AliveItem {
		if (this._targetCell.HasOccupier()) {
			const t = (this._targetCell.GetOccupier() as any) as AliveItem;
			if (t.IsEnemy(this._v.Identity)) {
				return t;
			}
		}

		if (this._targetCell.GetField() instanceof AliveItem) {
			const shield = (this._targetCell.GetField() as any) as AliveItem;
			if (shield.IsEnemy(this._v.Identity)) {
				return shield;
			}
		}
		return null;
	}

	public GetArrivals(): Cell[] {
		return [ this._v.GetCurrentCell() ];
	}

	public GetKind(): OrderKind {
		return OrderKind.Target;
	}
	public GetCells(): Cell[] {
		if (this._currentOrder) {
			return this._currentOrder.GetCells();
		} else {
			return [];
		}
	}

	public Do(): void {
		if (this.GetState() === OrderState.None) {
			this._currentcell = this._targetCell;
			this.SetCurrentOrder(new MonitoredOrder(this._currentcell, this._v));
			this.SetState(OrderState.Pending);
			this.ShowUi();
		}

		if (!this.GetTarget()) {
			this.Cancel();
			return;
		}

		if (!this._currentOrder.IsDone()) {
			this._currentOrder.Do();
		}
	}

	public Cancel(): void {
		super.Cancel();
		this._currentOrder.Cancel();
		this._targetUi.Destroy();
	}

	private ShowUi() {
		this._targetUi = new BasicItem(this._targetCell.GetBoundingBox(), SvgArchive.direction.target, ZKind.Sky);
		this._targetUi.SetVisible(this._v.IsSelected.bind(this._v));
		this._targetUi.SetAlive(
			() => this._v.IsAlive() && this.GetTarget().IsAlive() && this._v.GetMainTarget() === this.GetTarget()
		);
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
}
