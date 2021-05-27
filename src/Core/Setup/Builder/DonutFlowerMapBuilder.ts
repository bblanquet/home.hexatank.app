import { DonutMapBuilder } from './DonutMapBuilder';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { IMapBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';

export class DonutFlowerMapBuilder implements IMapBuilder {
	private _donutBuilder: DonutMapBuilder;

	constructor() {
		this._donutBuilder = new DonutMapBuilder();
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		const initCoos = this._donutBuilder.GetAllCoos(ranges);
		const coordinates = new Dictionnary<HexAxial>();
		initCoos.forEach((initCoo) => {
			coordinates.Add(initCoo.ToString(), initCoo);
		});
		const areaEngine = new AreaSearch(coordinates);
		var areas = areaEngine.GetAreas(coordinates.Get(coordinates.Keys()[0]));
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

	public GetRefCoo(ranges: number): HexAxial {
		return this._donutBuilder.GetRefCoo(ranges);
	}

	public GetAreaCoos(ranges: number): Array<HexAxial> {
		const coordinates = new Dictionnary<HexAxial>();
		this.GetAllCoos(ranges).forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaSearch = new AreaSearch(coordinates);
		var result = areaSearch.GetAreas(coordinates.Get(coordinates.Keys()[0]));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
