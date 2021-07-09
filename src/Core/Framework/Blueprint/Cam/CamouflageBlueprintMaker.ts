import { GameSettings } from '../../../Framework/GameSettings';
import { DecoratingPrints } from '../../../Items/Cell/Decorator/DecoratingPrints';
import { DecoratingFactory } from '../../../Items/Cell/Decorator/ForestFactory';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { CheeseFlowerMapBuilder } from '../../Builder/CheeseFlowerMapBuilder';
import { DonutFlowerMapBuilder } from '../../Builder/DonutFlowerMapBuilder';
import { FartestPointsFinder } from '../../Builder/FartestPointsFinder';
import { FlowerMapBuilder } from '../../Builder/FlowerMapBuilder';
import { HFlowerMapBuilder } from '../../Builder/HFlowerMapBuilder';
import { IMapBuilder } from '../../Builder/IPlaygroundBuilder';
import { RectangleFlowerMapBuilder } from '../../Builder/RectangleFlowerMapBuilder';
import { TriangleFlowerMapBuilder } from '../../Builder/TriangleFlowerMapBuilder';
import { XFlowerMapBuilder } from '../../Builder/XFlowerMapBuilder';
import { YFlowerMapBuilder } from '../../Builder/YFlowerMapBuilder';
import { CellPrint } from '../Items/CellPrint';
import { CellType } from '../Items/CellType';
import { MapKind } from '../Items/MapKind';
import { MapShape } from '../Items/MapShape';
import { CamouflageBlueprint } from './CamouflageBlueprint';
import { MapItemPair } from './MapItemPair';

export class CamouflageBluePrintMaker {
	private _builders: Dictionary<IMapBuilder>;
	constructor() {
		this._builders = new Dictionary<IMapBuilder>();
		this._builders.Add(MapShape.Flower.toString(), new FlowerMapBuilder());
		this._builders.Add(MapShape.Cheese.toString(), new CheeseFlowerMapBuilder());
		this._builders.Add(MapShape.Donut.toString(), new DonutFlowerMapBuilder());
		this._builders.Add(MapShape.Triangle.toString(), new TriangleFlowerMapBuilder());
		this._builders.Add(MapShape.Y.toString(), new YFlowerMapBuilder());
		this._builders.Add(MapShape.H.toString(), new HFlowerMapBuilder());
		this._builders.Add(MapShape.X.toString(), new XFlowerMapBuilder());
		this._builders.Add(MapShape.Rectangle.toString(), new RectangleFlowerMapBuilder());
	}

	public GetBluePrint(): CamouflageBlueprint {
		const blueprint = new CamouflageBlueprint();
		blueprint.MapMode = MapKind.Forest;
		const mapItems = new Array<CellPrint>();
		const mapBuilder = this._builders.Get(MapShape.Rectangle.toString());
		const coos = mapBuilder.GetAllCoos(6);
		GameSettings.MapSize = coos.length;
		const cells = Dictionary.To<HexAxial>((e) => e.ToString(), coos);
		const areas = mapBuilder.GetAreaCoos(6);
		const farthestPointManager = new FartestPointsFinder();
		const excluded = new Dictionary<HexAxial>();

		const patrolCells = [
			CellPrint.New(1, 5),
			CellPrint.New(6, 6),
			CellPrint.New(8, 4),
			CellPrint.New(2, 3),
			CellPrint.New(2, 1),
			CellPrint.New(8, 1),
			CellPrint.New(4, 0),
			CellPrint.New(7, 0)
		];
		blueprint.Patrols = [
			MapItemPair.New(patrolCells[0], patrolCells[1]),
			MapItemPair.New(patrolCells[2], patrolCells[3]),
			MapItemPair.New(patrolCells[4], patrolCells[5]),
			MapItemPair.New(patrolCells[6], patrolCells[7])
		];

		const spots = farthestPointManager.GetPoints(areas, cells, 2);
		blueprint.Goal = new MapItemPair();
		//add hqs
		spots.forEach((spot, index) => {
			let hqMapItem = new CellPrint();
			hqMapItem.Position = spot;
			hqMapItem.Type = CellType.Hq;
			mapItems.push(hqMapItem);
			excluded.Add(spot.ToString(), spot);
			spot.GetNeighbours().forEach((p) => {
				excluded.Add(p.ToString(), p);
			});
			if (index === 0) {
				blueprint.Goal.Departure = CellPrint.New(spot.Q, spot.R);
			}

			if (index === 1) {
				blueprint.Goal.Arrival = CellPrint.New(spot.Q, spot.R);
			}
		});

		const decorator = new DecoratingPrints(
			DecoratingFactory.Obstacles.Get(MapKind[MapKind.Forest]),
			DecoratingFactory.Decorations.Get(MapKind[MapKind.Forest])
		);
		//decorate tree, water, stone the map
		coos.forEach((coo) => {
			let mapItem = new CellPrint();
			mapItem.Position = coo;
			if (
				!excluded.Exist(coo.ToString()) &&
				!patrolCells.some((p) => p.Position.Q === mapItem.Position.Q && p.Position.R === mapItem.Position.R)
			) {
				mapItem.Type = decorator.GetDecoration();
				if (this.IsBlockingItem(decorator, mapItem) && !this.IsAroundEmpty(coo, mapItems, decorator)) {
					mapItem.Type = CellType.None;
				}
			} else {
				mapItem.Type = CellType.None;
			}

			if (mapItems.filter((mi) => mi.Position.ToString() === mapItem.Position.ToString()).length === 0) {
				mapItems.push(mapItem);
			}
		});

		blueprint.Cells = mapItems;
		blueprint.CenterItem = mapItems[0];
		return blueprint;
	}

	public IsAroundEmpty(coo: HexAxial, mapItems: CellPrint[], decorator: DecoratingPrints): boolean {
		let isEmpty = true;
		coo.GetNeighbours(1).forEach((n) => {
			const mapItem = mapItems.find((m) => m.Position.ToString() === n.ToString());
			if (mapItem && this.IsBlockingItem(decorator, mapItem)) {
				isEmpty = false;
			}
		});
		return isEmpty;
	}

	private IsBlockingItem(decorator: DecoratingPrints, mapItem: CellPrint): boolean {
		return decorator.Obstacles.some((e) => e.Type === mapItem.Type);
	}
}
