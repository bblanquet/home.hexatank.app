import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { IMapBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { CircleMapBuilder } from './CircleMapBuilder';

export class FlowerMapBuilder implements IMapBuilder {
	private _hexagonalBuilder: CircleMapBuilder;

	constructor() {
		this._hexagonalBuilder = new CircleMapBuilder();
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		const initCoos = this._hexagonalBuilder.GetAllCoos(ranges);
		const coordinates = new Dictionnary<HexAxial>();
		initCoos.forEach((initCoo) => {
			coordinates.Add(initCoo.ToString(), initCoo);
		});
		const areaEngine = new AreaSearch(coordinates);
		var areas = areaEngine.GetAreas(coordinates.Get(this.GetRefCoo(ranges).ToString()));
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
		return this._hexagonalBuilder.GetRefCoo(ranges);
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
