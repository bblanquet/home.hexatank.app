import { Cell } from './Cell';
import { Vehicle } from '../Unit/Vehicle';
import { Point } from '../../Utils/Geometry/Point';

export class CellFinder {
	public GetCell(cells: Array<Cell>, vehcile: Vehicle): Cell {
		let min = this.GetCost(cells[0].GetBoundingBox().GetCentralPoint(), vehcile.GetBoundingBox().GetCentralPoint());
		let selectedcell = cells[0];
		cells.filter((c) => !c.IsBlocked()).forEach((cell) => {
			var m = this.GetCost(cell.GetBoundingBox().GetCentralPoint(), vehcile.GetBoundingBox().GetCentralPoint());
			if (m < min) {
				min = m;
				selectedcell = cell;
			}
		});
		return selectedcell;
	}

	private GetCost(a: Point, b: Point): number {
		return Math.sqrt(Math.pow(b.X - a.X, 2)) + Math.sqrt(Math.pow(b.Y - a.Y, 2));
	}
}
