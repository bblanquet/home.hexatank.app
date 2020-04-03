import { HexAxial } from '../../Utils/Geometry/HexAxial';

export interface IPlaygroundBuilder {
	Build(ranges: number): Array<HexAxial>;
	GetMidle(ranges: number): HexAxial;
	GetAreaCoordinates(ranges: number): Array<HexAxial>;
	GetRange(ranges: number, range: number): HexAxial[];
}
