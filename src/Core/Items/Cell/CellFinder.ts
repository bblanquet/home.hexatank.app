import { GameSettings } from './../../Framework/GameSettings';
import { Cell } from './Cell';
import { Vehicle } from '../Unit/Vehicle';

export class CellFinder {
	public GetClosestCell(cells: Array<Cell>, vehcile: Vehicle): Cell {
		let minDistance = cells[0]
			.GetCoordinate()
			.ToPixel(GameSettings.Size)
			.GetDistance(vehcile.GetBoundingBox().GetCentralPoint());
		let closestCell = cells[0];
		cells.filter((c) => !c.IsBlocked()).forEach((cell) => {
			var distance = cell
				.GetCoordinate()
				.ToPixel(GameSettings.Size)
				.GetDistance(vehcile.GetBoundingBox().GetCentralPoint());
			if (distance < minDistance) {
				minDistance = distance;
				closestCell = cell;
			}
		});
		return closestCell;
	}
}
