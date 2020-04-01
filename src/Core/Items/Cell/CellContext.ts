import { ICell } from './ICell';
import { HexAxial } from '../../Utils/Geometry/HexAxial';

export class CellContext<T extends ICell> {
	private Cells: { [id: string]: T } = {};

	public Clear(): void {
		this.Cells = {};
	}

	public Add(Cell: T): void {
		this.Cells[Cell.GetCoordinate().ToString()] = Cell;
	}

	public Get(coordinate: HexAxial): T {
		if (coordinate.ToString() in this.Cells) {
			return this.Cells[coordinate.ToString()];
		} else {
			return null;
		}
	}

	public IsEmpty(): boolean {
		for (var prop in this.Cells) {
			if (this.Cells.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	}

	public Exist(coordinate: HexAxial): boolean {
		return coordinate.ToString() in this.Cells;
	}

	public All(): T[] {
		var all = new Array<T>();
		for (var key in this.Cells) {
			all.push(<T>(<unknown>this.Cells[key]));
		}
		return all;
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