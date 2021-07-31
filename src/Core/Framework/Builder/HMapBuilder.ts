import { HexOffset } from '../../../Utils/Geometry/HexOffset';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { IMapBuilder } from './IPlaygroundBuilder';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { ErrorCat, ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';

export class HMapBuilder implements IMapBuilder {
	public GetRefCoo(ranges: number): HexAxial {
		return new HexOffset(1, 1).ToAxial();
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		ranges = ranges + 4;

		if (ranges < 2) {
			ErrorHandler.Throw(ErrorCat.invalidParameter, `param: ${ranges}`);
		}

		if (ranges % 2 !== 0) {
			ErrorHandler.Throw(ErrorCat.invalidParameter, `param: ${ranges}`);
		}

		const result = new Array<HexOffset>();
		for (let x = 0; x < ranges; x++) {
			for (let y = 0; y < ranges; y++) {
				if (!(this.Begin(ranges, x, y) || this.End(ranges, x, y))) {
					result.push(new HexOffset(x, y));
				}
			}
		}

		return result.map((e) => e.ToAxial());
	}

	private Begin(ranges: number, x: number, y: number): boolean {
		const half = Math.round(ranges / 2) - 1;
		const quarter = Math.round(ranges / 4);
		return x <= quarter && Math.round(half - quarter / 2) < y && y < Math.round(half + quarter / 2);
	}

	private End(ranges: number, x: number, y: number): boolean {
		const half = Math.round(ranges / 2) - 1;
		const quarter = Math.round(ranges / 4);
		return ranges - (quarter + 1) <= x && Math.round(half - quarter / 2) < y && y < Math.round(half + quarter / 2);
	}

	public GetAreaCoos(ranges: number): HexAxial[] {
		const coordinates = new Dictionary<HexAxial>();
		this.GetAllCoos(ranges).forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaSearch = new AreaSearch(coordinates);
		var result = areaSearch.GetAreas(this.GetRefCoo(ranges));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
