import { DonutMapBuilder } from './DonutMapBuilder';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Utils/AreaSearch';

export class DonutFlowerMapBuilder implements IPlaygroundBuilder {
	private _donutBuilder: DonutMapBuilder;

	constructor() {
		this._donutBuilder = new DonutMapBuilder();
	}

	public Build(ranges: number): HexAxial[] {
		const initCoos = this._donutBuilder.Build(ranges);
		const coordinates = new Dictionnary<HexAxial>();
		initCoos.forEach((initCoo) => {
			coordinates.Add(initCoo.ToString(), initCoo);
		});
		const areaEngine = new AreaSearch();
		var areas = areaEngine.GetAreas(coordinates, coordinates.Get(coordinates.Keys()[0]));
		var result = new Array<HexAxial>();
		areas.forEach((area) => {
			const around = area.GetNeighbours();
			if (around.length === 6) {
				result.push(area);
				around.forEach((cell) => {
					result.push(cell);
				});
			}
		});
		return result;
	}

	public GetMidle(ranges: number): HexAxial {
		return this._donutBuilder.GetMidle(ranges);
	}

	GetRange(ranges: number, range: number): HexAxial[] {
		const cells = new Array<HexAxial>();
		const cell = this.GetMidle(ranges);

		cell.GetSpecificRange(range).forEach((c) => {
			cells.push(c);
		});
		return cells;
	}

	public GetAreaCoordinates(ranges: number): Array<HexAxial> {
		const coordinates = new Dictionnary<HexAxial>();
		this.Build(ranges).forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaSearch = new AreaSearch();
		var result = areaSearch.GetAreas(coordinates, coordinates.Get(coordinates.Keys()[0]));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
