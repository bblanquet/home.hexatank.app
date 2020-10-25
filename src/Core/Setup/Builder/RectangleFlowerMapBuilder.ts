import { RectangleMapBuilder } from './RectangleMapBuilder';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';

export class RectangleFlowerMapBuilder implements IPlaygroundBuilder {
	private _rectangleBuilder: RectangleMapBuilder;

	constructor() {
		this._rectangleBuilder = new RectangleMapBuilder();
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		const r = ranges + 4;
		const rectangle = this._rectangleBuilder.GetAllCoos(r);
		const coordinates = new Dictionnary<HexAxial>();
		rectangle.forEach((initCoo) => {
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
		return this._rectangleBuilder.GetRefCoo(ranges);
	}

	public GetAreaCoos(ranges: number): Array<HexAxial> {
		const r = ranges + 4;
		const coordinates = new Dictionnary<HexAxial>();
		const rectangle = this.GetAllCoos(ranges);
		rectangle.forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaEngine = new AreaSearch(coordinates);
		var result = areaEngine.GetAreas(coordinates.Get(this.GetRefCoo(r).ToString()));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
