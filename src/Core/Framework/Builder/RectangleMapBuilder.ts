import { HexOffset } from './../../../Utils/Geometry/HexOffset';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { IMapBuilder } from './IPlaygroundBuilder';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { ErrorCat, ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';

export class RectangleMapBuilder implements IMapBuilder {
	public GetRefCoo(ranges: number): HexAxial {
		return new HexOffset(1, 1).ToAxial();
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		if (ranges < 2) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidParameter])));
		}

		if (ranges % 2 !== 0) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidParameter])));
		}

		const result = new Array<HexOffset>();
		for (let q = 0; q < ranges; q++) {
			for (let r = 0; r < ranges; r++) {
				result.push(new HexOffset(q, r));
			}
		}

		return result.map((e) => e.ToAxial());
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
