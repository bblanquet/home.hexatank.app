import { OrderState } from './OrderState';
import { BasicOrder } from './BasicOrder';
import { Cell } from '../../Items/Cell/Cell';
import { AStarEngine } from '../AStarEngine';
import { AStarHelper } from '../AStarHelper';
import { Order } from './Order';
import { OrderKind } from './OrderKind';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { ShieldField } from '../../Items/Cell/Field/Bonus/ShieldField';

export class OrderMonitor extends Order {
	private _order: BasicOrder;
	constructor(protected Destination: Cell, protected Vehicle: Vehicle) {
		super();
		const result = this.GetPath();
		if (result) {
			this.SetCurrentOrder(new BasicOrder(this.Vehicle, result));
		} else {
			this.SetState(OrderState.Failed);
		}
	}

	private SetCurrentOrder(order: BasicOrder): void {
		this.Clear();
		this._order = order;
		this._order.OnPathCreated.On(this.InvokePathCreated.bind(this));
		this._order.OnNextCell.On(this.InvokeNextCell.bind(this));
	}

	private Clear() {
		if (this._order) {
			this._order.OnPathCreated.Off(this.InvokePathCreated.bind(this));
			this._order.OnNextCell.Off(this.InvokeNextCell.bind(this));
		}
	}

	private InvokePathCreated(src: any, cells: Cell[]): void {
		this.OnPathCreated.Invoke(this, cells);
	}

	private InvokeNextCell(src: any, cell: Cell): void {
		this.OnNextCell.Invoke(this, cell);
	}

	GetKind(): OrderKind {
		if (this._order) {
			return this._order.GetKind();
		} else {
			return OrderKind.Simple;
		}
	}

	public GetState(): OrderState {
		if (this._order) {
			return this._order.GetState();
		} else {
			return super.GetState();
		}
	}

	GetCells(): Cell[] {
		if (this._order) {
			return this._order.GetCells();
		} else {
			return [];
		}
	}
	GetArrivals(): Cell[] {
		if (this._order) {
			this._order.GetArrivals();
		} else {
			return [];
		}
	}
	Do(): void {
		if (this._order.IsDone() && this.Vehicle.GetCurrentCell() !== this.Destination) {
			const road = this.GetPath();
			if (road && 0 < road.length) {
				this.SetCurrentOrder(new BasicOrder(this.Vehicle, road));
			} else {
				this.Clear();
				this._order = null;
				this.SetState(OrderState.Failed);
			}
		} else if (this._order.IsDone() && this.Vehicle.GetCurrentCell() === this.Destination) {
			this.Clear();
			this._order = null;
			this.SetState(OrderState.Passed);
		} else {
			this._order.Do();
		}
	}

	protected GetPath(): Cell[] {
		const filter = (c: Cell) => !isNullOrUndefined(c) && this.IsAccessible(c);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		let result = new Array<Cell>();
		const orderedLimitlessRoad = new Array<Cell>();
		const limitlessPath = this.LimitlessPath();
		for (let index = limitlessPath.length - 1; -1 < index; index--) {
			orderedLimitlessRoad.push(limitlessPath[index]);
		}
		orderedLimitlessRoad.some((candidate) => {
			const nextcells = new AStarEngine<Cell>(filter, cost).GetPath(
				this.Vehicle.GetCurrentCell(),
				candidate,
				true
			);
			if (nextcells) {
				result = nextcells;
				return true;
			}
			return false;
		});
		if (result && 0 < result.length) {
			this.OnPathCreated.Invoke(this, result);
		}
		return result;
	}

	private IsAccessible(c: Cell): boolean {
		const field = c.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(this.Vehicle.Identity) && !c.HasOccupier();
		}
		return !c.IsBlocked();
	}

	private LimitlessPath() {
		const limitless = (c: Cell) => !isNullOrUndefined(c);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(limitless, cost).GetPath(this.Vehicle.GetCurrentCell(), this.Destination, true);
	}
}
