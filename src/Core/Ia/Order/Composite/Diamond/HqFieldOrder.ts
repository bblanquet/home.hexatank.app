import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { SmartSimpleOrder } from '../SmartSimpleOrder';
import { Cell } from '../../../../Items/Cell/Cell';
import { Vehicle } from '../../../../Items/Unit/Vehicle';

export class HqFieldOrder extends SmartSimpleOrder {
	constructor(public Hq: Headquarter, private _vehicule: Vehicle) {
		super(Hq.GetCell(), _vehicule);
	}

	protected GetClosestCell(): Cell {
		let cells = this.GetHqCells(this.Hq);
		if (0 < cells.length) {
			let cell = this.CellFinder.GetClosestCell(cells, this._vehicule);
			this.FinalOriginalGoal = cell;
			return cell;
		} else {
			return null;
		}
	}

	public GetGoals(): Cell[] {
		return [ this.Hq.GetCell() ];
	}

	private GetHqCells(hq: Headquarter): Array<Cell> {
		return hq.GetCell().GetNeighbourhood().map((c) => <Cell>c);
	}
}
