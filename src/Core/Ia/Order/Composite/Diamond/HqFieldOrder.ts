import { HeadQuarterField } from './../../../../Items/Cell/Field/Hq/HeadquarterField';
import { IHeadquarter } from './../../../../Items/Cell/Field/Hq/IHeadquarter';
import { Cell } from '../../../../Items/Cell/Cell';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { AStarEngine } from '../../../AStarEngine';
import { AStarHelper } from '../../../AStarHelper';
import { MonitoredOrder } from '../../MonitoredOrder';
import { TypeTranslator } from '../../../../Items/Cell/Field/TypeTranslator';
import { IOrderGiver } from './IOrderGiver';

export class HqFieldOrder implements IOrderGiver {
	private _hq: IHeadquarter;
	private _vehicule: Vehicle;

	constructor(headquarter: IHeadquarter, vehicle: Vehicle) {
		this._vehicule = vehicle;
		this._hq = headquarter;
	}

	public GetOrder(): MonitoredOrder {
		const hqField = this.GetHqField();
		if (hqField) {
			return new MonitoredOrder(hqField, this._vehicule);
		} else {
			return null;
		}
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
		let cells = new Array<Cell>();
		const around = this._hq.GetCell().GetNearby(1);
		const candidateRoads = around.map((n) => this.GetRoad(n)).filter((n) => n);
		if (0 < candidateRoads.length) {
			const shortest = Math.min(...candidateRoads.map((c) => c.length));
			cells = candidateRoads.find((r) => r.length === shortest);
		}
		return cells;
	}

	private GetRoad(cell: Cell) {
		const filter = (c: Cell) => c && TypeTranslator.IsAccessible(c, this._vehicule);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(filter, cost).GetPath(this._vehicule.GetCurrentCell(), cell, true);
	}
}
