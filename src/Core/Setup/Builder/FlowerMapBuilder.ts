import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { CircleMapBuilder } from './CircleMapBuilder';

export class FlowerMapBuilder implements IPlaygroundBuilder {
	private _hexagonalBuilder: CircleMapBuilder;

	constructor() {
		this._hexagonalBuilder = new CircleMapBuilder();
	}

	public Build(ranges: number): HexAxial[] {
		const initCoos = this._hexagonalBuilder.Build(ranges);
		const coordinates = new Dictionnary<HexAxial>();
		initCoos.forEach((initCoo) => {
			coordinates.Add(initCoo.ToString(), initCoo);
		});
		const areaEngine = new AreaSearch(coordinates);
		var areas = areaEngine.GetAreas(coordinates.Get(this.GetMidle(ranges).ToString()));
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
		return this._hexagonalBuilder.GetMidle(ranges);
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
		const areaEngine = new AreaSearch(coordinates);
		var result = areaEngine.GetAreas(coordinates.Get(this.GetMidle(ranges).ToString()));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
