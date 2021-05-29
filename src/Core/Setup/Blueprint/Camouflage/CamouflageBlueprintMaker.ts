import { MapItemPair } from './MapItemPair';
import { MapType } from '../MapType';
import { RectangleFlowerMapBuilder } from '../../Builder/RectangleFlowerMapBuilder';
import { YFlowerMapBuilder } from '../../Builder/YFlowerMapBuilder';
import { XFlowerMapBuilder } from '../../Builder/XFlowerMapBuilder';
import { HFlowerMapBuilder } from '../../Builder/HFlowerMapBuilder';
import { TriangleFlowerMapBuilder } from '../../Builder/TriangleFlowerMapBuilder';
import { CheeseFlowerMapBuilder } from '../../Builder/CheeseFlowerMapBuilder';
import { DonutFlowerMapBuilder } from '../../Builder/DonutFlowerMapBuilder';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { SandDecorator } from '../../../Items/Cell/Decorator/SandDecorator';
import { IceDecorator } from '../../../Items/Cell/Decorator/IceDecorator';
import { MapEnv } from '../MapEnv';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { ForestDecorator } from '../../../Items/Cell/Decorator/ForestDecorator';
import { MapItem } from '../MapItem';
import { FlowerMapBuilder } from '../../Builder/FlowerMapBuilder';
import { FartestPointsFinder } from '../../Builder/FartestPointsFinder';
import { DecorationType } from '../DecorationType';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';
import { IMapBuilder } from '../../Builder/IPlaygroundBuilder';
import { GameSettings } from '../../../Framework/GameSettings';
import { CamouflageBlueprint } from './CamouflageBlueprint';

export class CamouflageBluePrintMaker {
	private _builders: Dictionnary<IMapBuilder>;
	constructor() {
		this._builders = new Dictionnary<IMapBuilder>();
		this._builders.Add(MapType.Flower.toString(), new FlowerMapBuilder());
		this._builders.Add(MapType.Cheese.toString(), new CheeseFlowerMapBuilder());
		this._builders.Add(MapType.Donut.toString(), new DonutFlowerMapBuilder());
		this._builders.Add(MapType.Triangle.toString(), new TriangleFlowerMapBuilder());
		this._builders.Add(MapType.Y.toString(), new YFlowerMapBuilder());
		this._builders.Add(MapType.H.toString(), new HFlowerMapBuilder());
		this._builders.Add(MapType.X.toString(), new XFlowerMapBuilder());
		this._builders.Add(MapType.Rectangle.toString(), new RectangleFlowerMapBuilder());
	}

	public GetBluePrint(): CamouflageBlueprint {
		const blueprint = new CamouflageBlueprint();
		blueprint.MapMode = MapEnv.forest;
		const mapItems = new Array<MapItem>();
		const mapBuilder = this._builders.Get(MapType.Rectangle.toString());
		const coos = mapBuilder.GetAllCoos(6);
		GameSettings.MapSize = coos.length;
		const cells = Dictionnary.To<HexAxial>((e) => e.ToString(), coos);
		const areas = mapBuilder.GetAreaCoos(6);
		const farthestPointManager = new FartestPointsFinder();
		const excluded = new Dictionnary<HexAxial>();

		const patrolCells = [
			MapItem.Create(1, 5),
			MapItem.Create(6, 6),
			MapItem.Create(8, 4),
			MapItem.Create(2, 3),
			MapItem.Create(2, 1),
			MapItem.Create(8, 1),
			MapItem.Create(4, 0),
			MapItem.Create(7, 0)
		];
		blueprint.Patrols = [
			MapItemPair.Create(patrolCells[0], patrolCells[1]),
			MapItemPair.Create(patrolCells[2], patrolCells[3]),
			MapItemPair.Create(patrolCells[4], patrolCells[5]),
			MapItemPair.Create(patrolCells[6], patrolCells[7])
		];

		const spots = farthestPointManager.GetPoints(areas, cells, 2);
		blueprint.Goal = new MapItemPair();
		//add hqs
		spots.forEach((spot, index) => {
			let hqMapItem = new MapItem();
			hqMapItem.Position = spot;
			hqMapItem.Type = DecorationType.Hq;
			mapItems.push(hqMapItem);
			excluded.Add(spot.ToString(), spot);
			spot.GetNeighbours().forEach((p) => {
				excluded.Add(p.ToString(), p);
			});
			if (index === 0) {
				blueprint.Goal.Departure = MapItem.Create(spot.Q, spot.R);
			}

			if (index === 1) {
				blueprint.Goal.Arrival = MapItem.Create(spot.Q, spot.R);
			}
		});

		var decorator: Decorator = this.GetDecorator(MapEnv.forest);
		//decorate tree, water, stone the map
		coos.forEach((coo) => {
			let mapItem = new MapItem();
			mapItem.Position = coo;
			if (
				!excluded.Exist(coo.ToString()) &&
				!patrolCells.some((p) => p.Position.Q === mapItem.Position.Q && p.Position.R === mapItem.Position.R)
			) {
				mapItem.Type = decorator.GetDecoration();
				if (this.IsBlockingItem(decorator, mapItem) && !this.IsAroundEmpty(coo, mapItems, decorator)) {
					mapItem.Type = DecorationType.None;
				}
			} else {
				mapItem.Type = DecorationType.None;
			}

			if (mapItems.filter((mi) => mi.Position.ToString() === mapItem.Position.ToString()).length === 0) {
				mapItems.push(mapItem);
			}
		});

		blueprint.Items = mapItems;
		blueprint.CenterItem = mapItems[0];
		return blueprint;
	}

	public IsAroundEmpty(coo: HexAxial, mapItems: MapItem[], decorator: Decorator): boolean {
		let isEmpty = true;
		coo.GetNeighbours(1).forEach((n) => {
			const mapItem = mapItems.find((m) => m.Position.ToString() === n.ToString());
			if (mapItem && this.IsBlockingItem(decorator, mapItem)) {
				isEmpty = false;
			}
		});
		return isEmpty;
	}

	private IsBlockingItem(decorator: Decorator, mapItem: MapItem): boolean {
		return decorator.BlockingCells.some((e) => e.Kind === mapItem.Type);
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
}
