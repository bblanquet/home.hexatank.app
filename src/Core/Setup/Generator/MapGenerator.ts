import { TriangleFlowerMapBuilder } from './../Builder/TriangleFlowerMapBuilder';
import { CheeseFlowerMapBuilder } from './../Builder/CheeseFlowerMapBuilder';
import { DonutFlowerMapBuilder } from './../Builder/DonutFlowerMapBuilder';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { SandDecorator } from '../../Items/Cell/Decorator/SandDecorator';
import { IceDecorator } from '../../Items/Cell/Decorator/IceDecorator';
import { MapEnv } from './MapEnv';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { ForestDecorator } from '../../Items/Cell/Decorator/ForestDecorator';
import { DistanceHelper } from '../../Items/Unit/MotionHelpers/DistanceHelper';
import { MapContext } from './MapContext';
import { MapItem } from './MapItem';
import { FlowerMapBuilder } from '../Builder/FlowerMapBuilder';
import { FartestPointsFinder } from '../Builder/FartestPointsFinder';
import { DecorationType } from './DecorationType';
import { DiamondHq } from './DiamondHq';
import { Decorator } from '../../Items/Cell/Decorator/Decorator';
import { IPlaygroundBuilder } from '../Builder/IPlaygroundBuilder';

export class MapGenerator {
	private _builders: Dictionnary<IPlaygroundBuilder>;
	constructor() {
		this._builders = new Dictionnary<IPlaygroundBuilder>();
		this._builders.Add('Flower', new FlowerMapBuilder());
		this._builders.Add('Cheese', new CheeseFlowerMapBuilder());
		this._builders.Add('Donut', new DonutFlowerMapBuilder());
		this._builders.Add('Triangle', new TriangleFlowerMapBuilder());
	}

	public GetMapDefinition(mapSize: number, mapType: string, hqCount: number, mapMode: MapEnv): MapContext {
		const context = new MapContext();
		context.MapMode = mapMode;
		const mapItems = new Array<MapItem>();
		const mapBuilder = this._builders.Get(mapType);
		const cellPositions = mapBuilder.GetAllCoos(mapSize);

		const cells = new Dictionnary<HexAxial>();
		cellPositions.forEach((cell) => {
			cells.Add(cell.ToString(), cell);
		});

		const areas = mapBuilder.GetAreaCoos(mapSize);
		const border = Dictionnary.To<HexAxial>(
			(e) => e.ToString(),
			areas.filter((a) => AreaSearch.IsBorder(a, cells))
		);
		const farthestPointManager = new FartestPointsFinder();

		const borderAreas = areas.filter((a) => border.Exist(a.ToString()));
		const hqPositions = farthestPointManager.GetPoints(borderAreas, hqCount);
		const diamondPositions = this.GetDiamonds(hqPositions, cells, hqCount);

		const excluded = new Dictionnary<HexAxial>();
		let hqs = new Array<MapItem>();
		//add hqs
		hqPositions.forEach((hq) => {
			let hqMapItem = new MapItem();
			hqMapItem.Position = hq;
			hqMapItem.Type = DecorationType.Hq;
			mapItems.push(hqMapItem);
			excluded.Add(hq.ToString(), hq);
			hq.GetNeighbours().forEach((p) => {
				excluded.Add(p.ToString(), p);
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
			excluded.Add(diamondCoo.ToString(), diamondCoo);
			diamondCoo.GetNeighbours().forEach((p) => {
				excluded.Add(p.ToString(), p);
			});
			let hqDiamond = new DiamondHq();
			hqDiamond.Diamond = diamonMapItem;
			hqDiamond.Hq = hqs[diamondPositions.indexOf(diamondCoo)];
			context.Hqs.push(hqDiamond);
		});

		var decorator: Decorator = this.GetDecorator(mapMode);
		//decorate tree, water, stone the map
		cellPositions.forEach((coo) => {
			let mapItem = new MapItem();
			mapItem.Position = coo;
			if (!excluded.Exist(coo.ToString())) {
				mapItem.Type = decorator.GetDecoration();
			} else {
				mapItem.Type = DecorationType.None;
			}

			if (mapItems.filter((mi) => mi.Position.ToString() === mapItem.Position.ToString()).length === 0) {
				mapItems.push(mapItem);
			}
		});

		context.Items = mapItems;
		context.CenterItem = mapItems[0];
		//mapItems.filter((m) => m.Position.Q === center.Q && m.Position.R === center.R)[0];
		return context;
	}

	private GetDecorator(mapMode: MapEnv) {
		var decorator: Decorator = null;
		if (mapMode === MapEnv.forest) {
			decorator = new ForestDecorator();
		} else if (mapMode === MapEnv.ice) {
			decorator = new IceDecorator();
		} else {
			decorator = new SandDecorator();
		}
		return decorator;
	}

	private GetDiamonds(
		hqcells: Array<HexAxial>,
		coordinates: Dictionnary<HexAxial>,
		hqCount: number
	): Array<HexAxial> {
		const diamonds = new Array<HexAxial>();
		const areaEngine = new AreaSearch(coordinates);
		let forbiddencells = new Array<HexAxial>();
		hqcells.forEach((hqcell) => {
			forbiddencells = forbiddencells.concat(areaEngine.GetIncludedFirstRange(hqcell));
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
		const areaEngine = new AreaSearch(coordinates);
		const secondRange = areaEngine
			.GetIncludedSecondRange(cell)
			.filter((c) => !forbiddencells.some((fc) => fc.Q == c.Q && fc.R == c.R));
		var result = DistanceHelper.GetRandomElement(secondRange);
		secondRange.forEach((c) => {
			forbiddencells.push(c);
		});
		return result;
	}
}
