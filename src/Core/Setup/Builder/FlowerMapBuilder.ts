import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Area/AreaSearch';
import { HexagonalMapBuilder } from './HexagonalMapBuilder';

export class FlowerMapBuilder implements IPlaygroundBuilder {
	private _hexagonalBuilder: HexagonalMapBuilder;

	constructor() {
		this._hexagonalBuilder = new HexagonalMapBuilder();
	}

	public Build(seize: number): HexAxial[] {
		const initCoos = this._hexagonalBuilder.Build(seize);
		const coordinates = new Dictionnary<HexAxial>();
		initCoos.forEach((initCoo) => {
			coordinates.Add(initCoo.ToString(), initCoo);
		});
		const areaEngine = new AreaSearch();
		var areas = areaEngine.GetAreas(coordinates, coordinates.Get(this.GetMidle(seize).ToString()));
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

	public GetMidle(n: number): HexAxial {
		return this._hexagonalBuilder.GetMidle(n);
	}

	public GetAreaMiddlecell(size: number): Array<HexAxial> {
		const initialcells = this._hexagonalBuilder.Build(size);
		const coordinates = new Dictionnary<HexAxial>();
		initialcells.forEach((coordinate) => {
			coordinates.Add(coordinate.ToString(), coordinate);
		});
		const areaSearch = new AreaSearch();
		var result = areaSearch.GetAreas(coordinates, coordinates.Get(this.GetMidle(size).ToString()));
		result.shift();
		return result.filter((a) => a.GetNeighbours().length === 6);
	}
}
