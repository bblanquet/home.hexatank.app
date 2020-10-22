import { HexAxial } from '../../Utils/Geometry/HexAxial';

export interface IPlaygroundBuilder {
	GetAllCoos(ranges: number): Array<HexAxial>;
	GetRefCoo(ranges: number): HexAxial;
	GetAreaCoos(ranges: number): Array<HexAxial>;
}
