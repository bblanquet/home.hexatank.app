import { DiamondField } from './../../../../Items/Cell/Field/DiamondField';
import { MonitoredOrder } from './../../MonitoredOrder';
import { Cell } from '../../../../Items/Cell/Cell';
import { Diamond } from '../../../../Items/Cell/Field/Diamond';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { AStarEngine } from '../../../AStarEngine';
import { AStarHelper } from '../../../AStarHelper';
import { ShieldField } from '../../../../Items/Cell/Field/Bonus/ShieldField';

export class DiamondFieldOrder {
	private _monitoredOrder: MonitoredOrder;
	private _diamond: Diamond;
	private _vehicule: Vehicle;

	constructor(diamond: Diamond, vehicle: Vehicle) {
		this._vehicule = vehicle;
		this._diamond = diamond;
	}

	public GetOrder(): MonitoredOrder {
		const cell = this.GetDiamondField();
		if (cell) {
			this._monitoredOrder = new MonitoredOrder(cell, this._vehicule);
		} else {
			this._monitoredOrder = new MonitoredOrder(this._vehicule.GetCurrentCell(), this._vehicule);
		}
		return this._monitoredOrder;
	}

	public IsOrder(order: MonitoredOrder) {
		return this._monitoredOrder === order;
	}

	private GetDiamondField(): Cell {
		const cells = this.GetDiamondRoad();
		if (cells) {
			return cells.find((c) => c.GetField() instanceof DiamondField);
		}
		return null;
	}

	private GetDiamondRoad(): Array<Cell> {
		const filter = (c: Cell) => !isNullOrUndefined(c) && this.IsDiamondAccessible(c);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		const cells = new AStarEngine<Cell>(filter, cost).GetPath(
			this._vehicule.GetCurrentCell(),
			this._diamond.GetCell(),
			true
		);

		return cells;
	}

	private IsDiamondAccessible(cell: Cell): boolean {
		const field = cell.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(this._vehicule.Identity);
		}
		if (field === this._diamond) {
			return true;
		}
		return !cell.IsBlocked();
	}
}
