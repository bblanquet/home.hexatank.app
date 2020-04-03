import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Area/AreaSearch';

export class CircleMapBuilder implements IPlaygroundBuilder {
	public GetMidle(ranges: number): HexAxial {
		return new HexAxial(ranges / 2, ranges / 2);
	}

	public Build(ranges: number): HexAxial[] {
		if (ranges < 2) {
			throw new Error();
		}

		if (ranges % 2 !== 0) {
			throw new Error();
		}

		const cells = new Array<HexAxial>();
		const cell = this.GetMidle(ranges);

		for (let range = 0; range <= ranges; range++) {
			cell.GetSpecificRange(range).forEach((c) => {
				cells.push(c);
			});
		}

		return cells;
	}

	GetRange(ranges: number, range: number): HexAxial[] {
		const cells = new Array<HexAxial>();
		const cell = this.GetMidle(ranges);

		cell.GetSpecificRange(range).forEach((c) => {
			cells.push(c);
		});
		return cells;
	}

	public GetAreaCoordinates(ranges: number): HexAxial[] {
		const coordinates = new Dictionnary<HexAxial>();
		this.Build(ranges).forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaSearch = new AreaSearch();
		var result = areaSearch.GetAreas(coordinates, coordinates.Get(this.GetMidle(ranges).ToString()));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
