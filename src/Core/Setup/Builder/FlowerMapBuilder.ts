import { CellProperties } from '../../Items/Cell/CellProperties';
import { IPlaygroundBuilder } from './IPlaygroundBuilder';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaEngine } from '../../Ia/Area/AreaEngine';
import { CellContext } from '../../Items/Cell/CellContext';
import { HexagonalMapBuilder } from './HexagonalMapBuilder';

export class FlowerMapBuilder implements IPlaygroundBuilder<CellProperties> {
	private _hexagonalBuilder: HexagonalMapBuilder;

	constructor() {
		this._hexagonalBuilder = new HexagonalMapBuilder();
	}

	public Build(seize: number): CellProperties[] {
		const initialcells = this._hexagonalBuilder.Build(seize);
		const container = new CellContext<CellProperties>();
		initialcells.forEach((cell) => {
			container.Add(cell);
		});
		const areaEngine = new AreaEngine<CellProperties>();
		var areas = areaEngine.GetAreas(container, <CellProperties>container.Get(this.GetMidle(seize)));
		var result = new Array<CellProperties>();
		areas.forEach((area) => {
			const cells = container.GetNeighbourhood(area.GetCoordinate());
			if (cells.length === 6) {
				result.push(area);
				cells.forEach((cell) => {
					result.push(<CellProperties>cell);
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
		const container = new CellContext<CellProperties>();
		initialcells.forEach((cell) => {
			container.Add(cell);
		});
		const areaEngine = new AreaEngine();
		var areas = areaEngine.GetAreas(container, <CellProperties>container.Get(this.GetMidle(size)));
		const result = areas.map((a) => a.GetCoordinate());
		result.shift();
		return result.filter((a) => container.GetNeighbourhood(a).length === 6);
	}
}
