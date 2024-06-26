import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { IMapBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { HMapBuilder } from './HMapBuilder';

export class HFlowerMapBuilder implements IMapBuilder {
	private _hBuilder: HMapBuilder;

	constructor() {
		this._hBuilder = new HMapBuilder();
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		const r = ranges + 4;
		const hMap = this._hBuilder.GetAllCoos(r);
		const coordinates = new Dictionary<HexAxial>();
		hMap.forEach((initCoo) => {
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
		return this._hBuilder.GetRefCoo(ranges);
	}

	public GetAreaCoos(ranges: number): Array<HexAxial> {
		const r = ranges + 4;
		const coordinates = new Dictionary<HexAxial>();
		const x = this._hBuilder.GetAllCoos(r);
		x.forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaEngine = new AreaSearch(coordinates);
		var result = areaEngine.GetAreas(coordinates.Get(this.GetRefCoo(r).ToString()));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
