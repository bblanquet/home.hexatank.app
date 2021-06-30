import { ISpot } from '../../../Utils/Geometry/ISpot';
import { Point } from '../../../Utils/Geometry/Point';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';

export interface ICell<T extends ICell<T>> extends ISpot<T> {
	GetHexCoo(): HexAxial;
	GetCentralPoint(): Point;
	Coo(): string;
}
