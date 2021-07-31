import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { IMapBuilder } from './IPlaygroundBuilder';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { ErrorCat, ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';
import { MapSize } from '../Blueprint/Items/MapSize';

export class YMapBuilder implements IMapBuilder {
	public GetRefCoo(ranges: number): HexAxial {
		return new HexAxial(1, 1);
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		ranges += 2;

		if (ranges < 2) {
			ErrorHandler.Throw(ErrorCat.invalidParameter, `param: ${ranges}`);
		}

		if (ranges % 2 !== 0) {
			ErrorHandler.Throw(ErrorCat.invalidParameter, `param: ${ranges}`);
		}

		const result = new Array<HexAxial>();
		for (let r = 0; r < ranges; r++) {
			const qRange = ranges - r;
			for (let q = 0; q < qRange; q++) {
				const half = Math.round(qRange / 2);
				const quarter = Math.round(qRange / 4);
				if (
					!(ranges / 6 < quarter && Math.round(half - quarter / 2) < q && q < Math.round(half + quarter / 2))
				) {
					result.push(new HexAxial(q, r));
				}
			}
		}

		return result;
	}

	public GetAreaCoos(ranges: number): HexAxial[] {
		const coordinates = new Dictionary<HexAxial>();
		this.GetAllCoos(ranges).forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaSearch = new AreaSearch(coordinates);
		var result = areaSearch.GetAreas(coordinates.Get(this.GetRefCoo(ranges).ToString()));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
