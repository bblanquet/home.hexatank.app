import { CellContext } from './../src/Core/Items/Cell/CellContext';
import { CellProperties } from './../src/Core/Items/Cell/CellProperties';
import { BoundingBox } from './../src/Core/Utils/Geometry/BoundingBox';
import { ICell } from './../src/Core/Items/Cell/ICell';
import { HexAxial } from '../src/Core/Utils/Geometry/HexAxial';
import { Point } from '../src/Core/Utils/Geometry/Point';
import { GameSettings } from '../src/Core/Framework/GameSettings';

export class SimpleCell implements ICell {
	Coordinate: HexAxial;
	BoundingBox: BoundingBox;
	Size: number;

	constructor(coordinate: HexAxial, private _cells: CellContext<SimpleCell>) {
		this.Coordinate = coordinate;
		this.Size = GameSettings.Size;
		this.BoundingBox = new BoundingBox();
		this.BoundingBox.Width = CellProperties.GetWidth(this.Size);
		this.BoundingBox.Height = CellProperties.GetHeight(this.Size);
		var pos = this.Coordinate.ToPixel(this.Size);
		this.BoundingBox.X = pos.X;
		this.BoundingBox.Y = pos.Y;
	}
	GetFilteredNeighbourhood(filter: (cell: ICell) => boolean): ICell[] {
		var cells = new Array<ICell>();
		this.Coordinate.GetNeighbours().forEach((coordinate) => {
			var cell = this._cells.Get(coordinate);
			if (cell != null) {
				cells.push(cell);
			}
		});
		return cells;
	}
	GetCostRatio(): number {
		return 1;
	}

	public GetCentralPoint(): Point {
		return this.BoundingBox.GetCentralPoint();
	}

	public GetCoordinate(): HexAxial {
		return this.Coordinate;
	}

	public static GetWidth(size: number) {
		return 2 * size;
	}

	public static GetHeight(size: number) {
		return size * Math.sqrt(3);
	}

	public GetNeighbourhood(): Array<ICell> {
		var cells = new Array<ICell>();
		this.Coordinate.GetNeighbours().forEach((coordinate) => {
			var cell = this._cells.Get(coordinate);
			if (cell != null) {
				cells.push(cell);
			}
		});
		return cells;
	}
}
