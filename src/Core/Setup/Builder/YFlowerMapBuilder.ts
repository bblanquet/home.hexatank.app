import { YMapBuilder } from './YMapBuilder';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';

export class YFlowerMapBuilder implements IPlaygroundBuilder {
	private _yBuilder: YMapBuilder;

	constructor() {
		this._yBuilder = new YMapBuilder();
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		const r = (ranges - 2) * 3;
		const triangle = this._yBuilder.GetAllCoos(r);
		const coordinates = new Dictionnary<HexAxial>();
		triangle.forEach((initCoo) => {
			coordinates.Add(initCoo.ToString(), initCoo);
		});
		const areaEngine = new AreaSearch(coordinates);
		var areas = areaEngine.GetAreas(coordinates.Get(this.GetRefCoo(r).ToString()));
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
		return this._yBuilder.GetRefCoo(ranges);
	}

	public GetAreaCoos(ranges: number): Array<HexAxial> {
		const coordinates = new Dictionnary<HexAxial>();
		this.GetAllCoos(ranges).forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaEngine = new AreaSearch(coordinates);
		var result = areaEngine.GetAreas(coordinates.Get(this.GetRefCoo(ranges).ToString()));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
