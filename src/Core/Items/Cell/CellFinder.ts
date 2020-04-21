import { Cell } from './Cell';
import { Vehicle } from '../Unit/Vehicle';
import { Point } from '../../Utils/Geometry/Point';

export class CellFinder {
	public GetClosestCell(cells: Array<Cell>, vehcile: Vehicle): Cell {
		let minDistance = this.GetCost(
			cells[0].GetBoundingBox().GetCentralPoint(),
			vehcile.GetBoundingBox().GetCentralPoint()
		);
		let closestCell = cells[0];
		cells.filter((c) => !c.IsBlocked()).forEach((cell) => {
			var distance = this.GetCost(
				cell.GetBoundingBox().GetCentralPoint(),
				vehcile.GetBoundingBox().GetCentralPoint()
			);
			if (distance < minDistance) {
				minDistance = distance;
				closestCell = cell;
			}
		});
		return closestCell;
	}

	private GetCost(a: Point, b: Point): number {
		return Math.abs(Math.sqrt(Math.pow(b.X - a.X, 2)) + Math.sqrt(Math.pow(b.Y - a.Y, 2)));
	}
}
