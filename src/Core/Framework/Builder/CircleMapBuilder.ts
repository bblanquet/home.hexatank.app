import { Dictionary } from '../../Utils/Collections/Dictionary';
import { IMapBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { ErrorCat, ErrorHandler } from '../../Utils/Exceptions/ErrorHandler';

export class CircleMapBuilder implements IMapBuilder {
	public GetRefCoo(ranges: number): HexAxial {
		return new HexAxial(ranges / 2, ranges / 2);
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		if (ranges < 2) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidParameter])));
		}

		if (ranges % 2 !== 0) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidParameter])));
		}

		const cells = new Array<HexAxial>();
		const cell = this.GetRefCoo(ranges);

		for (let range = 0; range <= ranges; range++) {
			cell.GetSpecificRange(range).forEach((c) => {
				cells.push(c);
			});
		}

		return cells;
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
