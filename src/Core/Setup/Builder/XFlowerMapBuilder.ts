import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { XMapBuilder } from './XMapBuilder';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';

export class XFlowerMapBuilder implements IPlaygroundBuilder {
	private _xBuilder: XMapBuilder;

	constructor() {
		this._xBuilder = new XMapBuilder();
	}

	public GetAllCoos(ranges: number): HexAxial[] {
		const r = ranges + 4;
		const hMap = this._xBuilder.GetAllCoos(r);
		const coordinates = Dictionnary.To((e) => e.ToString(), hMap);
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
		return this._xBuilder.GetRefCoo(ranges);
	}

	public GetAreaCoos(ranges: number): Array<HexAxial> {
		const r = ranges + 4;
		const hMap = this._xBuilder.GetAllCoos(r);
		const coordinates = Dictionnary.To((e) => e.ToString(), hMap);
		const areaEngine = new AreaSearch(coordinates);
		var areas = areaEngine.GetAreas(coordinates.Get(this.GetRefCoo(r).ToString()));
		return areas;
	}
}
