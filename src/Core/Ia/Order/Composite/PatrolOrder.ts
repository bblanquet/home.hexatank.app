import { OrderState } from '../OrderState';
import { Cell } from '../../../Items/Cell/Cell';
import { Order } from '../Order';
import { BasicItem } from '../../../Items/BasicItem';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { OrderKind } from '../OrderKind';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { MonitoredOrder } from '../MonitoredOrder';

export class PatrolOrder extends Order {
	private _currentPatrolcell: Cell;
	private _currentOrder: MonitoredOrder;
	private _patrolPathDisplay: Array<BasicItem>;

	constructor(private _patrolcells: Array<Cell>, private _v: Vehicle) {
		super();
		this._patrolPathDisplay = new Array<BasicItem>();
		this.CreatePath();
	}

	public GetArrivals(): Cell[] {
		return this._patrolcells;
	}

	public GetKind(): OrderKind {
		return OrderKind.Patrol;
	}
	public GetPath(): Cell[] {
		if (this._currentOrder) {
			return this._currentOrder.GetPath();
		} else {
			return [];
		}
	}

	public Cancel(): void {
		super.Cancel();
		this._patrolPathDisplay.forEach((patrol) => {
			patrol.Destroy();
		});
		this._patrolPathDisplay = [];

		if (this._currentOrder) {
			this._currentOrder.Cancel();
		}
	}

	private CreatePath(): void {
		if (!isNullOrUndefined(this._patrolcells) && 0 < this._patrolcells.length) {
			this._patrolcells.forEach((cell) => {
				const pathItem = new BasicItem(cell.GetBoundingBox(), SvgArchive.direction.moving);

				pathItem.SetVisible(this._v.IsSelected.bind(this._v));
				pathItem.SetAlive(this._v.IsAlive.bind(this._v));

				this._patrolPathDisplay.push(pathItem);
			});
		}
	}

	public Update(): void {
		if (this.GetState() === OrderState.None) {
			this._currentPatrolcell = this._patrolcells[0];
			this.SetState(OrderState.Pending);
			this.StartMoving();
		}

		if (this._currentOrder.IsDone()) {
			var index = (this._patrolcells.indexOf(this._currentPatrolcell) + 1) % this._patrolcells.length;
			this._currentPatrolcell = this._patrolcells[index];
			this.StartMoving();
		} else {
			this._currentOrder.Update();
		}
	}

	private StartMoving() {
		this.SetCurrentOrder(new MonitoredOrder(this._currentPatrolcell, this._v));
		this._currentOrder.Update();
	}

	private SetCurrentOrder(order: MonitoredOrder): void {
		this.ClearChild();
		this._currentOrder = order;
		this._currentOrder.OnPathFound.On(this.InvokePathCreated.bind(this));
		this._currentOrder.OnNextStep.On(this.InvokeNextCell.bind(this));
	}

	private ClearChild() {
		if (this._currentOrder) {
			this._currentOrder.OnPathFound.Off(this.InvokePathCreated.bind(this));
			this._currentOrder.OnNextStep.Off(this.InvokeNextCell.bind(this));
		}
	}

	private InvokePathCreated(src: any, cells: Cell[]): void {
		this.OnPathFound.Invoke(this, cells);
	}

	private InvokeNextCell(src: any, cell: Cell): void {
		this.OnNextStep.Invoke(this, cell);
	}
}
