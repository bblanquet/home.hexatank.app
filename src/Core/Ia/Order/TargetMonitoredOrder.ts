import { TargetOrder } from './Composite/TargetOrder';
import { TypeTranslator } from './../../Items/Cell/Field/TypeTranslator';
import { OrderState } from './OrderState';
import { BasicOrder } from './BasicOrder';
import { Cell } from '../../Items/Cell/Cell';
import { AStarEngine } from '../AStarEngine';
import { AStarHelper } from '../AStarHelper';
import { Order } from './Order';
import { OrderKind } from './OrderKind';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { ShieldField } from '../../Items/Cell/Field/Bonus/ShieldField';
import { WaterField } from '../../Items/Cell/Field/WaterField';
import { Tank } from '../../Items/Unit/Tank';
import { TargetCellOrder } from './Composite/TargetCellOrder';

export class TargetMonitoredOrder extends Order {
	private _order: Order;
	constructor(protected Destination: Cell, protected Tank: Tank) {
		super();
		this.Reset();
	}

	public Reset(): void {
		if (this.Tank.GetCurrentCell() === this.Destination) {
			this.SetState(OrderState.Passed);
		} else {
			this.UpdateOrder();
		}
	}

	private UpdateOrder() {
		const result = this.GetDestination();
		if (result) {
			if (this.HasTarget(result)) {
				this.SetCurrentOrder(new TargetCellOrder(this.Tank, result));
			} else {
				this.SetCurrentOrder(new BasicOrder(this.Tank, this.GetRoad(result)));
			}
		} else {
			this.Clear();
			this.SetState(OrderState.Failed);
		}
	}

	private SetCurrentOrder(order: Order): void {
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
		if (this._order.IsDone() && this.Tank.GetCurrentCell() !== this.Destination) {
			this.UpdateOrder();
		} else if (this._order.IsDone() && this.Tank.GetCurrentCell() === this.Destination) {
			this.Clear();
			this._order = null;
			this.SetState(OrderState.Passed);
		} else {
			this._order.Do();
		}
	}

	protected GetDestination(): Cell {
		let result: Cell = null;
		const sortLimitlessRoad = new Array<Cell>();
		const limitlessPath = this.LimitlessPath();
		for (let index = limitlessPath.length - 1; -1 < index; index--) {
			sortLimitlessRoad.push(limitlessPath[index]);
		}
		sortLimitlessRoad.some((candidate, index) => {
			const road = this.GetRoad(candidate);
			if (road) {
				const previous = index - 1;
				if (0 <= previous) {
					const cell = sortLimitlessRoad[previous];
					if (this.HasTarget(cell)) {
						result = cell;
						return true;
					}
				}
				result = candidate;
				return true;
			}
			return false;
		});
		return result;
	}

	private GetRoad(cell: Cell) {
		const filter = (c: Cell) => !isNullOrUndefined(c) && this.IsAccessible(c);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(filter, cost).GetPath(this.Tank.GetCurrentCell(), cell, true);
	}

	private HasTarget(cell: Cell): boolean {
		return cell.IsBlocked() && TypeTranslator.HasEnemy(cell, this.Tank.Identity);
	}

	private IsAccessible(c: Cell): boolean {
		const field = c.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(this.Tank.Identity) && !c.HasOccupier();
		}
		return !c.IsBlocked();
	}

	private LimitlessPath() {
		const limitless = (c: Cell) => !isNullOrUndefined(c) && !(c.GetField() instanceof WaterField);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(limitless, cost).GetPath(this.Tank.GetCurrentCell(), this.Destination, true);
	}
}
