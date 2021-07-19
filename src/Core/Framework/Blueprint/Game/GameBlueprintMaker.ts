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
import { SizeProvider } from './SizeProvider';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { DistanceHelper } from '../../../Items/Unit/MotionHelpers/DistanceHelper';
import { GameBlueprint } from './GameBlueprint';
import { CellPrint } from '../Items/CellPrint';
import { FlowerMapBuilder } from '../../Builder/FlowerMapBuilder';
import { FartestPointsFinder } from '../../Builder/FartestPointsFinder';
import { CellType } from '../Items/CellType';
import { DiamondHq } from './DiamondHq';
import { IMapBuilder } from '../../Builder/IPlaygroundBuilder';
import { GameSettings } from '../../../Framework/GameSettings';
import { DecoratingPrints } from '../../../Items/Cell/Decorator/DecoratingPrints';
import { DecoratingFactory } from '../../../Items/Cell/Decorator/ForestFactory';
import { PlayerBlueprint } from './HqBlueprint';

export class GameBlueprintMaker {
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

	public GetBluePrint(mapType: MapShape, mapMode: MapKind, players: PlayerBlueprint[]): GameBlueprint {
		const size = new SizeProvider().GetSize(players.length, mapType);
		const blueprint = new GameBlueprint();
		blueprint.MapMode = mapMode;
		const mapItems = new Array<CellPrint>();
		const mapBuilder = this._builders.Get(mapType.toString());
		const coos = mapBuilder.GetAllCoos(size);
		GameSettings.MapSize = coos.length;
		const cells = Dictionary.To<HexAxial>((e) => e.ToString(), coos);
		const areas = mapBuilder.GetAreaCoos(size);
		const farthestPointManager = new FartestPointsFinder();
		const excluded = new Dictionary<HexAxial>();

		const hqCoos = farthestPointManager.GetPoints(areas, cells, players.length);
		const diamondCoos = this.GetDiamonds(hqCoos, cells, players.length);
		let hqs = new Array<CellPrint>();
		//add hqs
		hqCoos.forEach((hq) => {
			let hqMapItem = new CellPrint();
			hqMapItem.Coo = hq;
			hqMapItem.Type = CellType.Hq;
			mapItems.push(hqMapItem);
			excluded.Add(hq.ToString(), hq);
			hq.GetNeighbours().forEach((p) => {
				excluded.Add(p.ToString(), p);
			});
			hqs.push(hqMapItem);
		});

		blueprint.Hqs = new Array<DiamondHq>();
		//add diamonds and join them to hq
		diamondCoos.forEach((diamondCoo, index) => {
			let diamonMapItem = new CellPrint();
			diamonMapItem.Coo = diamondCoo;
			diamonMapItem.Type = CellType.Hq;
			mapItems.push(diamonMapItem);
			excluded.Add(diamondCoo.ToString(), diamondCoo);
			diamondCoo.GetNeighbours().forEach((p) => {
				excluded.Add(p.ToString(), p);
			});
			let hqDiamond = new DiamondHq();
			hqDiamond.Player = players[index];
			hqDiamond.DiamondCell = diamonMapItem;
			hqDiamond.Cell = hqs[diamondCoos.indexOf(diamondCoo)];
			blueprint.Hqs.push(hqDiamond);
		});

		const decorator = new DecoratingPrints(
			DecoratingFactory.Obstacles.Get(MapKind[mapMode]),
			DecoratingFactory.Decorations.Get(MapKind[mapMode])
		);
		//decorate tree, water, stone the map
		coos.forEach((coo) => {
			let mapItem = new CellPrint();
			mapItem.Coo = coo;
			if (!excluded.Exist(coo.ToString())) {
				mapItem.Type = decorator.GetDecoration();
			} else {
				mapItem.Type = CellType.None;
			}

			if (mapItems.filter((mi) => mi.Coo.ToString() === mapItem.Coo.ToString()).length === 0) {
				mapItems.push(mapItem);
			}
		});

		blueprint.PlayerName = players.find((p) => p.IsPlayer).Name;
		blueprint.Cells = mapItems;
		blueprint.CenterItem = mapItems[0];
		return blueprint;
	}

	private GetDiamonds(hqcells: Array<HexAxial>, coordinates: Dictionary<HexAxial>, hqCount: number): Array<HexAxial> {
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
		coordinates: Dictionary<HexAxial>
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
