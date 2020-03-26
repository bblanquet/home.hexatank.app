import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { ICell } from '../../Items/Cell/ICell';

export interface IPlaygroundBuilder<T extends ICell> {
	Build(n: number): Array<T>;
	GetMidle(n: number): HexAxial;
	GetAreaMiddlecell(n: number): Array<HexAxial>;
}
