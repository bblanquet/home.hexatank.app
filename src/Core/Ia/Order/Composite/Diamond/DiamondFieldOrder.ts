import { SmartSimpleOrder } from '../SmartSimpleOrder';
import { Cell } from '../../../../Items/Cell/Cell';
import { Diamond } from '../../../../Items/Cell/Field/Diamond';
import { Vehicle } from '../../../../Items/Unit/Vehicle';

export class DiamondFieldOrder extends SmartSimpleOrder {
	constructor(public Diamond: Diamond, vehicle: Vehicle) {
		super(Diamond.GetCell(), vehicle);
	}

	protected GetClosestCell(): Cell {
		let cells = this.GetDiamondCells(this.Diamond);
		if (0 < cells.length) {
			let cell = this.CellFinder.GetClosestCell(cells, this.Vehicle);
			this.FinalOriginalGoal = cell;
			return cell;
		} else {
			return null;
		}
	}

	private GetDiamondCells(hq: Diamond): Array<Cell> {
		return hq.GetCell().GetNeighbourhood().map((c) => <Cell>c);
	}
}
