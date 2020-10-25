import { IHex } from './../../Utils/Geometry/IHex';
import { Point } from '../../Utils/Geometry/Point';
import { HexAxial } from '../../Utils/Geometry/HexAxial';

export interface ICell<T extends ICell<T>> extends IHex<T> {
	GetHexCoo(): HexAxial;
	GetCentralPoint(): Point;
	Coo(): string;
}
