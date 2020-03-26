import { ICell } from './ICell';
import { HexAxial } from '../../Utils/Geometry/HexAxial';

export class CellContainer<T extends ICell> {
	private Cells: { [id: string]: T } = {};

	GetAll(): T[] {
		var all = new Array<T>();
		for (var key in this.Cells) {
			all.push(<T>(<unknown>this.Cells[key]));
		}
		return all;
	}

	public Clear(): void {
		this.Cells = {};
	}

	Add(Cell: T): void {
		this.Cells[Cell.GetCoordinate().ToString()] = Cell;
	}

	Get(coordinate: HexAxial): T {
		if (coordinate.ToString() in this.Cells) {
			return this.Cells[coordinate.ToString()];
		} else {
			return null;
		}
	}

	IsEmpty(): boolean {
		for (var prop in this.Cells) {
			if (this.Cells.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	}

	Exist(coordinate: HexAxial): boolean {
		return coordinate.ToString() in this.Cells;
	}

	public GetNeighbourhood(coordinate: HexAxial): Array<ICell> {
		var Cells = new Array<ICell>();
		coordinate.GetNeighbours().forEach((coordinate) => {
			var Cell = this.Get(coordinate);
			if (Cell != null) {
				Cells.push(Cell);
			}
		});
		return Cells;
	}
}
