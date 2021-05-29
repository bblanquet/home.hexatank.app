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
import { DiamondBlueprint } from './DiamondBlueprint';
import { DiamondHq } from '../Game/DiamondHq';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { DistanceHelper } from '../../../Items/Unit/MotionHelpers/DistanceHelper';

export class DiamondBlueprintMaker {
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

	public GetBluePrint(): DiamondBlueprint {
		const blueprint = new DiamondBlueprint();
		blueprint.MapMode = MapEnv.sand;
		const mapItems = new Array<MapItem>();
		const mapBuilder = this._builders.Get(MapType.Flower.toString());
		const coos = mapBuilder.GetAllCoos(4);
		GameSettings.MapSize = coos.length;
		const cells = Dictionnary.To<HexAxial>((e) => e.ToString(), coos);
		const excluded = new Dictionnary<HexAxial>();

		const diamondHq = new DiamondHq();
		diamondHq.Diamond = MapItem.Create(5, 1);
		diamondHq.Hq = MapItem.Create(1, 0);
		diamondHq.isIa = false;
		diamondHq.PlayerName = '';

		let hqMapItem = new MapItem();
		hqMapItem.Position = diamondHq.Hq.Position;
		hqMapItem.Type = DecorationType.Hq;
		mapItems.push(hqMapItem);
		excluded.Add(diamondHq.Hq.Position.ToString(), cells.Get(diamondHq.Hq.Position.ToString()));
		cells.Get(diamondHq.Hq.Position.ToString()).GetNeighbours().forEach((p) => {
			excluded.Add(p.ToString(), p);
		});

		//add diamonds and join them to hq
		let diamonMapItem = new MapItem();
		diamonMapItem.Position = diamondHq.Diamond.Position;
		diamonMapItem.Type = DecorationType.Hq;
		mapItems.push(diamonMapItem);
		excluded.Add(diamondHq.Diamond.Position.ToString(), cells.Get(diamondHq.Diamond.Position.ToString()));
		cells.Get(diamondHq.Diamond.Position.ToString()).GetNeighbours().forEach((p) => {
			excluded.Add(p.ToString(), p);
		});

		blueprint.HqDiamond = diamondHq;

		var decorator: Decorator = this.GetDecorator(MapEnv.sand);
		//decorate tree, water, stone the map
		coos.forEach((coo) => {
			let mapItem = new MapItem();
			mapItem.Position = coo;
			if (!excluded.Exist(coo.ToString())) {
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
		blueprint.CenterItem = mapItems[0];
		blueprint.Items = mapItems;
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
