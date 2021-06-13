import { IdleOrder } from './../../IdleOrder';
import { TypeTranslator } from './../../../../Items/Cell/Field/TypeTranslator';
import { DiamondField } from './../../../../Items/Cell/Field/DiamondField';
import { MonitoredOrder } from './../../MonitoredOrder';
import { Cell } from '../../../../Items/Cell/Cell';
import { Diamond } from '../../../../Items/Cell/Field/Diamond';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { AStarEngine } from '../../../AStarEngine';
import { AStarHelper } from '../../../AStarHelper';
import { Order } from '../../Order';
import { OrderState } from '../../OrderState';

export class DiamondFieldOrder {
	private _currentOrder: Order;
	private _diamond: Diamond;
	private _vehicule: Vehicle;

	constructor(diamond: Diamond, vehicle: Vehicle) {
		this._vehicule = vehicle;
		this._diamond = diamond;
	}

	public GetDiamond(): Diamond {
		return this._diamond;
	}

	public GetOrder(): Order {
		if (this.GetDiamond().GetCell().GetNearby(1).some((c) => c === this._vehicule.GetCurrentCell())) {
			this._currentOrder = new IdleOrder();
			this._currentOrder.SetState(OrderState.Passed);
			return this._currentOrder;
		} else {
			const diamondField = this.GetDiamondField();
			if (diamondField) {
				this._currentOrder = new MonitoredOrder(diamondField, this._vehicule);
				return this._currentOrder;
			}
			return null;
		}
	}

	public IsOrder(order: Order) {
		return this._currentOrder === order;
	}

	private GetDiamondField(): Cell {
		const cells = this.GetDiamondRoad();
		if (cells) {
			return cells.find((c) => c.GetField() instanceof DiamondField);
		}
		return null;
	}

	private GetDiamondRoad(): Array<Cell> {
		let cells = new Array<Cell>();
		const around = this._diamond.GetCell().GetNearby(1);
		const candidateRoads = around.map((n) => this.GetRoad(n)).filter((n) => n);
		if (0 < candidateRoads.length) {
			const shortest = Math.min(...candidateRoads.map((c) => c.length));
			cells = candidateRoads.find((r) => r.length === shortest);
		}
		return cells;
	}
	private GetRoad(cell: Cell) {
		const filter = (c: Cell) => c && TypeTranslator.IsAccessible(c, this._vehicule.Identity);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(filter, cost).GetPath(this._vehicule.GetCurrentCell(), cell, true);
	}
}
