import { HeadQuarterField } from './../../../../Items/Cell/Field/Hq/HeadquarterField';
import { IHeadquarter } from './../../../../Items/Cell/Field/Hq/IHeadquarter';
import { Cell } from '../../../../Items/Cell/Cell';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { ShieldField } from '../../../../Items/Cell/Field/Bonus/ShieldField';
import { AStarEngine } from '../../../AStarEngine';
import { AStarHelper } from '../../../AStarHelper';
import { MonitoredOrder } from '../../MonitoredOrder';

export class HqFieldOrder {
	private _monitoredOrder: MonitoredOrder;
	private _hq: IHeadquarter;
	private _vehicule: Vehicle;

	constructor(headquarter: IHeadquarter, vehicle: Vehicle) {
		this._vehicule = vehicle;
		this._hq = headquarter;
	}

	public GetOrder(): MonitoredOrder {
		const cell = this.GetHqField();
		if (cell) {
			this._monitoredOrder = new MonitoredOrder(cell, this._vehicule);
		} else {
			this._monitoredOrder = new MonitoredOrder(this._vehicule.GetCurrentCell(), this._vehicule);
		}
		return this._monitoredOrder;
	}

	private GetHqField(): Cell {
		const cells = this.GetHqRoad();
		if (cells) {
			return cells.find((c) => c.GetField() instanceof HeadQuarterField);
		} else {
			return null;
		}
	}

	private GetHqRoad(): Array<Cell> {
		const filter = (c: Cell) => !isNullOrUndefined(c) && this.IsHqAccess(c);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		const cells = new AStarEngine<Cell>(filter, cost).GetPath(
			this._vehicule.GetCurrentCell(),
			this._hq.GetCell(),
			true
		);

		return cells;
	}

	private IsHqAccess(cell: Cell): boolean {
		const field = cell.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(this._vehicule.Identity);
		}
		if (this._hq.GetCell() === cell) {
			return true;
		}
		return !cell.IsBlocked();
	}
}
