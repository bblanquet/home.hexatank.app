import { SmallBlueprint } from './SmallBlueprint';
import { MapShape } from '../Items/MapShape';
import { RectangleFlowerMapBuilder } from '../../Builder/RectangleFlowerMapBuilder';
import { YFlowerMapBuilder } from '../../Builder/YFlowerMapBuilder';
import { XFlowerMapBuilder } from '../../Builder/XFlowerMapBuilder';
import { HFlowerMapBuilder } from '../../Builder/HFlowerMapBuilder';
import { TriangleFlowerMapBuilder } from '../../Builder/TriangleFlowerMapBuilder';
import { CheeseFlowerMapBuilder } from '../../Builder/CheeseFlowerMapBuilder';
import { DonutFlowerMapBuilder } from '../../Builder/DonutFlowerMapBuilder';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { MapKind } from '../Items/MapKind';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { CellPrint } from '../Items/CellPrint';
import { FlowerMapBuilder } from '../../Builder/FlowerMapBuilder';
import { FartestPointsFinder } from '../../Builder/FartestPointsFinder';
import { CellType } from '../Items/CellType';
import { IMapBuilder } from '../../Builder/IPlaygroundBuilder';
import { GameSettings } from '../../GameSettings';
import { DecoratingPrints } from '../../../Items/Cell/Decorator/DecoratingPrints';
import { DecoratingFactory } from '../../../Items/Cell/Decorator/ForestFactory';

export class SmallBlueprintMaker {
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

	public GetBluePrint(kind: MapKind): SmallBlueprint {
		const blueprint = new SmallBlueprint();
		blueprint.MapMode = kind;
		const mapItems = new Array<CellPrint>();
		const mapBuilder = this._builders.Get(MapShape.Flower.toString());
		const coos = mapBuilder.GetAllCoos(4);
		GameSettings.MapSize = coos.length;
		const cells = Dictionary.To<HexAxial>((e) => e.ToString(), coos);
		const areas = mapBuilder.GetAreaCoos(4);
		const farthestPointManager = new FartestPointsFinder();
		const excluded = new Dictionary<HexAxial>();

		const spots = farthestPointManager.GetPoints(areas, cells, 2);
		//add hqs
		spots.forEach((spot, index) => {
			let hqMapItem = new CellPrint();
			hqMapItem.Coo = spot;
			hqMapItem.Type = CellType.Hq;
			mapItems.push(hqMapItem);
			excluded.Add(spot.ToString(), spot);
			spot.GetNeighbours().forEach((p) => {
				excluded.Add(p.ToString(), p);
			});
			if (index === 0) {
				blueprint.Departure = CellPrint.New(spot.Q, spot.R);
			}

			if (index === 1) {
				blueprint.Goal = CellPrint.New(spot.Q, spot.R);
			}
		});

		const decorator = new DecoratingPrints(
			DecoratingFactory.Obstacles.Get(MapKind[kind]),
			DecoratingFactory.Decorations.Get(MapKind[kind])
		);
		//decorate tree, water, stone the map
		coos.forEach((coo) => {
			let mapItem = new CellPrint();
			mapItem.Coo = coo;
			if (!excluded.Exist(coo.ToString())) {
				mapItem.Type = decorator.GetDecoration();
				if (this.IsBlockingItem(decorator, mapItem) && !this.IsAroundEmpty(coo, mapItems, decorator)) {
					mapItem.Type = CellType.None;
				}
			} else {
				mapItem.Type = CellType.None;
			}

			if (mapItems.filter((mi) => mi.Coo.ToString() === mapItem.Coo.ToString()).length === 0) {
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
			const mapItem = mapItems.find((m) => m.Coo.ToString() === n.ToString());
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
