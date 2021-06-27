import { GameSettings } from '../../../Framework/GameSettings';
import { DecoratingPrints } from '../../../Items/Cell/Decorator/DecoratingPrints';
import { DecoratingFactory } from '../../../Items/Cell/Decorator/ForestFactory';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { CheeseFlowerMapBuilder } from '../../Builder/CheeseFlowerMapBuilder';
import { DonutFlowerMapBuilder } from '../../Builder/DonutFlowerMapBuilder';
import { FlowerMapBuilder } from '../../Builder/FlowerMapBuilder';
import { HFlowerMapBuilder } from '../../Builder/HFlowerMapBuilder';
import { IMapBuilder } from '../../Builder/IPlaygroundBuilder';
import { RectangleFlowerMapBuilder } from '../../Builder/RectangleFlowerMapBuilder';
import { TriangleFlowerMapBuilder } from '../../Builder/TriangleFlowerMapBuilder';
import { XFlowerMapBuilder } from '../../Builder/XFlowerMapBuilder';
import { YFlowerMapBuilder } from '../../Builder/YFlowerMapBuilder';
import { DiamondHq } from '../Game/DiamondHq';
import { CellPrint } from '../Items/CellPrint';
import { CellType } from '../Items/CellType';
import { MapKind } from '../Items/MapKind';
import { MapShape } from '../Items/MapShape';
import { DiamondBlueprint } from './DiamondBlueprint';

export class DiamondBlueprintMaker {
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

	public GetBluePrint(): DiamondBlueprint {
		const blueprint = new DiamondBlueprint();
		blueprint.MapMode = MapKind.ice;
		const mapItems = new Array<CellPrint>();
		const mapBuilder = this._builders.Get(MapShape.Flower.toString());
		const coos = mapBuilder.GetAllCoos(4);
		GameSettings.MapSize = coos.length;
		const cells = Dictionary.To<HexAxial>((e) => e.ToString(), coos);
		const excluded = new Dictionary<HexAxial>();

		const diamondHq = new DiamondHq();
		diamondHq.Diamond = CellPrint.New(5, 1);
		diamondHq.Hq = CellPrint.New(1, 0);
		diamondHq.isIa = false;
		diamondHq.PlayerName = '';

		let hqMapItem = new CellPrint();
		hqMapItem.Position = diamondHq.Hq.Position;
		hqMapItem.Type = CellType.Hq;
		mapItems.push(hqMapItem);
		excluded.Add(diamondHq.Hq.Position.ToString(), cells.Get(diamondHq.Hq.Position.ToString()));
		cells.Get(diamondHq.Hq.Position.ToString()).GetNeighbours().forEach((p) => {
			excluded.Add(p.ToString(), p);
		});

		//add diamonds and join them to hq
		let diamonMapItem = new CellPrint();
		diamonMapItem.Position = diamondHq.Diamond.Position;
		diamonMapItem.Type = CellType.Hq;
		mapItems.push(diamonMapItem);
		excluded.Add(diamondHq.Diamond.Position.ToString(), cells.Get(diamondHq.Diamond.Position.ToString()));
		cells.Get(diamondHq.Diamond.Position.ToString()).GetNeighbours().forEach((p) => {
			excluded.Add(p.ToString(), p);
		});

		blueprint.HqDiamond = diamondHq;

		const decorator = new DecoratingPrints(
			DecoratingFactory.Obstacles.Get(MapKind[MapKind.ice]),
			DecoratingFactory.Decorations.Get(MapKind[MapKind.ice])
		);
		//decorate tree, water, stone the map
		coos.forEach((coo) => {
			let mapItem = new CellPrint();
			mapItem.Position = coo;
			if (!excluded.Exist(coo.ToString())) {
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
		blueprint.CenterItem = mapItems[0];
		blueprint.Cells = mapItems;
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
