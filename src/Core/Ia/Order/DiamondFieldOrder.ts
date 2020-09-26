import { SmartSimpleOrder } from './SmartSimpleOrder';
import { Cell } from '../../Items/Cell/Cell';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class DiamondFieldOrder extends SmartSimpleOrder {
	constructor(public Diamond: Diamond, private _vehicule: Vehicle) {
		super(Diamond.GetCell(), _vehicule);
	}

	protected GetClosestcell(): Cell {
		let cells = this.GetCells(this.Diamond);
		if (0 < cells.length) {
			let cell = this.cellFinder.GetClosestCell(cells, this._vehicule);
			this.OriginalDest = cell;
			return cell;
		} else {
			return null;
		}
	}

	private GetCells(hq: Diamond): Array<Cell> {
		return hq.GetCell().GetNeighbourhood().map((c) => <Cell>c);
	}
}
