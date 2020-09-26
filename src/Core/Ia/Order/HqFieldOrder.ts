import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { SmartSimpleOrder } from './SmartSimpleOrder';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class HqFieldOrder extends SmartSimpleOrder {
	constructor(public Hq: Headquarter, private _vehicule: Vehicle) {
		super(Hq.GetCell(), _vehicule);
	}

	protected GetClosestcell(): Cell {
		let cells = this.GetCells(this.Hq);
		if (0 < cells.length) {
			let cell = this.cellFinder.GetClosestCell(cells, this._vehicule);
			this.OriginalDest = cell;
			return cell;
		} else {
			return null;
		}
	}

	private GetCells(hq: Headquarter): Array<Cell> {
		return hq.GetCell().GetNeighbourhood().map((c) => <Cell>c);
	}
}
