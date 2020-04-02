import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { HexagonalMapBuilder } from './../Builder/HexagonalMapBuilder';
import { SandDecorator } from '../../Items/Cell/Decorator/SandDecorator';
import { MapMode } from './MapMode';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Area/AreaSearch';
import { ForestDecorator } from '../../Items/Cell/Decorator/ForestDecorator';
import { DistanceHelper } from '../../Items/Unit/MotionHelpers/DistanceHelper';
import { MapContext } from './MapContext';
import { MapItem } from './MapItem';
import { FlowerMapBuilder } from '../Builder/FlowerMapBuilder';
import { FartestPointsFinder } from '../Builder/FartestPointsFinder';
import { DecorationType } from './DecorationType';
import { DiamondHq } from './DiamondHq';
import { Decorator } from '../../Items/Cell/Decorator/Decorator';

export class MapGenerator {
	public GetMapDefinition(mapSize: number, mapType: string, hqCount: number, mapMode: MapMode): MapContext {
		const context = new MapContext();
		context.MapMode = mapMode;
		const mapItems = new Array<MapItem>();
		const mapBuilder = mapType === 'Flower' ? new FlowerMapBuilder() : new HexagonalMapBuilder();
		const cellPositions = mapBuilder.Build(mapSize);

		const container = new Dictionnary<HexAxial>();
		cellPositions.forEach((cell) => {
			container.Add(cell.ToString(), cell);
		});

		const center = mapBuilder.GetMidle(mapSize);
		const areas = mapBuilder.GetAreaMiddlecell(mapSize);
		const fatherPointManager = new FartestPointsFinder();

		const hqPositions = fatherPointManager.GetPoints(fatherPointManager.GetFartestPoints(center, areas), hqCount);
		const diamondPositions = this.GetDiamonds(hqPositions, container, hqCount);

		const excluded = new Array<HexAxial>();
		let hqs = new Array<MapItem>();
		//add hqs
		hqPositions.forEach((hq) => {
			let hqMapItem = new MapItem();
			hqMapItem.Position = hq;
			hqMapItem.Type = DecorationType.Hq;
			mapItems.push(hqMapItem);
			excluded.push(hq);
			hq.GetNeighbours().forEach((p) => {
				excluded.push(p);
			});
			hqs.push(hqMapItem);
		});

		context.Hqs = new Array<DiamondHq>();
		//add diamonds and join them to hq
		diamondPositions.forEach((diamondCoo) => {
			let diamonMapItem = new MapItem();
			diamonMapItem.Position = diamondCoo;
			diamonMapItem.Type = DecorationType.Hq;
			mapItems.push(diamonMapItem);
			excluded.push(diamondCoo);
			diamondCoo.GetNeighbours().forEach((p) => {
				excluded.push(p);
			});
			let hqDiamond = new DiamondHq();
			hqDiamond.Diamond = diamonMapItem;
			hqDiamond.Hq = hqs[diamondPositions.indexOf(diamondCoo)];
			context.Hqs.push(hqDiamond);
		});

		var decorator: Decorator = null;
		if (mapMode === MapMode.forest) {
			decorator = new ForestDecorator();
		} else {
			decorator = new SandDecorator();
		}
		//decorate tree, water, stone the map
		cellPositions.forEach((coo) => {
			let mapItem = new MapItem();
			mapItem.Position = coo;
			if (excluded.indexOf(coo) === -1) {
				mapItem.Type = decorator.GetDecoration();
			} else {
				mapItem.Type = DecorationType.None;
			}

			if (mapItems.filter((mi) => mi.Position.ToString() === mapItem.Position.ToString()).length === 0) {
				mapItems.push(mapItem);
			}
		});

		context.Items = mapItems;
		context.CenterItem = mapItems.filter((m) => m.Position.Q === center.Q && m.Position.R === center.R)[0];
		return context;
	}

	private GetDiamonds(
		hqcells: Array<HexAxial>,
		coordinates: Dictionnary<HexAxial>,
		hqCount: number
	): Array<HexAxial> {
		const diamonds = new Array<HexAxial>();
		const areaEngine = new AreaSearch();
		let forbiddencells = new Array<HexAxial>();
		hqcells.forEach((hqcell) => {
			forbiddencells = forbiddencells.concat(areaEngine.GetIncludedFirstRange(coordinates, hqcell));
		});
		for (let i = 0; i < hqCount; i++) {
			diamonds.push(this.GetDiamondPosition(hqcells[i], forbiddencells, coordinates));
		}
		return diamonds;
	}

	private GetDiamondPosition(
		cell: HexAxial,
		forbiddencells: HexAxial[],
		coordinates: Dictionnary<HexAxial>
	): HexAxial {
		const areaEngine = new AreaSearch();
		const secondRange = areaEngine
			.GetIncludedSecondRange(coordinates, cell)
			.filter((c) => !forbiddencells.some((fc) => fc.Q == c.Q && fc.R == c.R));
		var result = DistanceHelper.GetRandomElement(secondRange);
		secondRange.forEach((c) => {
			forbiddencells.push(c);
		});
		return result;
	}
}
