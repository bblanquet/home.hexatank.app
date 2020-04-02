import { OrderState } from './OrderState';
import { Cell } from '../../Items/Cell/Cell';
import { SimpleOrder } from './SimpleOrder';
import { Order } from './Order';
import { BasicItem } from '../../Items/BasicItem';
import { isNullOrUndefined } from 'util';
import { Archive } from '../../Framework/ResourceArchiver';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { GameHelper } from '../../Framework/GameHelper';

export class PatrolOrder extends Order {
	private _currentPatrolcell: Cell;
	private _currentOrder: SimpleOrder;
	private _patrolPathDisplay: Array<BasicItem>;

	constructor(private _patrolcells: Array<Cell>, private _v: Vehicle) {
		super();
		this._patrolPathDisplay = new Array<BasicItem>();
		this.CreatePath();
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
				const pathItem = new BasicItem(cell.GetBoundingBox(), Archive.direction.patrol);

				pathItem.SetVisible(this._v.IsSelected.bind(this._v));
				pathItem.SetAlive(this._v.IsAlive.bind(this._v));

				this._patrolPathDisplay.push(pathItem);
			});
		}
	}

	public Do(): void {
		if (this.State === OrderState.None) {
			this._currentPatrolcell = this._patrolcells[0];
			this.State = OrderState.Pending;
			this.StartMoving();
		}

		if (this._currentOrder.IsDone()) {
			var index = (this._patrolcells.indexOf(this._currentPatrolcell) + 1) % this._patrolcells.length;
			this._currentPatrolcell = this._patrolcells[index];
			this.StartMoving();
		} else {
			this._currentOrder.Do();
		}
	}

	private StartMoving() {
		this._currentOrder = new SimpleOrder(this._currentPatrolcell, this._v);
		this._currentOrder.Do();
	}
}
