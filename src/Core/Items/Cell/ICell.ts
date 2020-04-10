import { Point } from '../../Utils/Geometry/Point';
import { HexAxial } from '../../Utils/Geometry/HexAxial';

export interface ICell {
	GetCoordinate(): HexAxial;
	GetNeighbourhood(): Array<ICell>;
	GetFilteredNeighbourhood(filter: (cell: ICell) => boolean): Array<ICell>;
	GetCentralPoint(): Point;
	GetCostRatio(): number;
}
