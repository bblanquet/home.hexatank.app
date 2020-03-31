import { ICell } from '../../Items/Cell/ICell';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { isNullOrUndefined } from 'util';
import { CellContainer } from '../../Items/Cell/CellContainer';

export class AreaEngine<T extends ICell> {
	public GetAreas(cells: CellContainer<T>, cell: T): Array<T> {
		var result = new Array<T>();
		this.GetAllAreas(cells, cell, result);
		return result;
	}

	private GetAllAreas(cells: CellContainer<T>, currentcell: T, areas: Array<T>): void {
		if (areas.filter((a) => a === currentcell).length === 0) {
			areas.push(currentcell);
			var neighs = this.GetAroundAreas(cells, currentcell);
			neighs.forEach((neigh) => {
				this.GetAllAreas(cells, neigh, areas);
			});
		}
	}

	public GetAroundAreas(cells: CellContainer<T>, cell: T): Array<T> {
		var coo = cell.GetCoordinate();
		var result = new Array<T>();
		var shifts = [
			{ Q: -1, R: -2 },
			{ Q: 2, R: -3 },
			{ Q: 3, R: -1 },
			{ Q: 1, R: 2 },
			{ Q: -2, R: 3 },
			{ Q: -3, R: 1 }
		];

		shifts.forEach((shift) => {
			let ngcell = cells.Get(new HexAxial(coo.Q + shift.Q, coo.R + shift.R));
			if (!isNullOrUndefined(ngcell)) {
				result.push(ngcell);
			}
		});

		return result;
	}

	public GetFirstRangeAreas(container: CellContainer<T>, center: T): Array<T> {
		let innerCircle = this.GetAroundAreas(container, center);
		innerCircle.push(center);
		return innerCircle;
	}

	public GetSecondRangeAreas(container: CellContainer<T>, center: T): Array<T> {
		let outerCircle = new Array<T>();
		let innerCircle = this.GetAroundAreas(container, center);

		innerCircle.forEach((innercell) => {
			this.GetAroundAreas(container, innercell).forEach((outcell) => {
				outerCircle.push(outcell);
			});
		});

		return outerCircle.filter((v) => innerCircle.indexOf(v) === -1);
	}
}
