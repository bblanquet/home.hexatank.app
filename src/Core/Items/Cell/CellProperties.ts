import { GameSettings } from '../../Framework/GameSettings';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { Point } from '../../../Utils/Geometry/Point';

export class CellProperties {
	Coordinate: HexAxial;
	BoundingBox: BoundingBox;
	Size: number;

	constructor(coordinate: HexAxial) {
		this.Coordinate = coordinate;
		this.Size = GameSettings.Size;
		this.BoundingBox = new BoundingBox();
		this.BoundingBox.SetWidth(CellProperties.GetWidth(this.Size));
		this.BoundingBox.SetHeight(CellProperties.GetHeight(this.Size));
		var pos = this.Coordinate.ToPixel(this.Size);
		this.BoundingBox.SetX(pos.X);
		this.BoundingBox.SetY(pos.Y);
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
}
