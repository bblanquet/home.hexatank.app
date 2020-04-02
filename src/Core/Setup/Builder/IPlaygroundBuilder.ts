import { HexAxial } from '../../Utils/Geometry/HexAxial';

export interface IPlaygroundBuilder {
	Build(n: number): Array<HexAxial>;
	GetMidle(n: number): HexAxial;
	GetAreaMiddlecell(n: number): Array<HexAxial>;
}
