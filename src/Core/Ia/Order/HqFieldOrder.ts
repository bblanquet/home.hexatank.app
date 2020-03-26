import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { SimpleOrder } from './SimpleOrder';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class HqFieldOrder extends SimpleOrder {
	constructor(private _hq: Headquarter, private _vehicule: Vehicle) {
		super(_hq.GetCell(), _vehicule);
	}

	protected GetClosestcell(): Cell {
		let cells = this.GetCells(this._hq);
		if (0 < cells.length) {
			let cell = this.cellFinder.GetCell(cells, this._vehicule);
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
