import { CamouflageContext } from '../../Context/CamouflageContext';
import { Tank } from '../../../Items/Unit/Tank';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { AboveItem } from '../../../Items/AboveItem';
import { HqSkinHelper } from '../Hq/HqSkinHelper';
import { Truck } from '../../../Items/Unit/Truck';
import { SimpleFloor } from '../../../Items/Environment/SimpleFloor';
import { Cloud } from '../../../Items/Environment/Cloud';
import { CamouflageBlueprint } from '../../Blueprint/Cam/CamouflageBlueprint';
import { GameSettings } from '../../../Framework/GameSettings';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { Cell } from '../../../Items/Cell/Cell';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { MapKind } from '../../Blueprint/Items/MapKind';
import { Floor } from '../../../Items/Environment/Floor';
import { Identity } from '../../../Items/Identity';
import { PatrolOrder } from '../../../Ia/Order/Composite/PatrolOrder';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';
import { GameState } from '../../Context/GameState';

export class CamouflageRenderer {
	public Render(blueprint: CamouflageBlueprint, gameState: GameState): CamouflageContext {
		const cells = new Dictionary<Cell>();
		const vehicles = new Array<Vehicle>();

		blueprint.Cells.forEach((item) => {
			const cell = new Cell(new CellProperties(new HexAxial(item.Position.Q, item.Position.R)), cells);
			Decorator.Decorate(cell, item.Type);
			cell.InitSprite();
			cells.Add(cell.Coo(), cell);
		});

		const areas = new AreaSearch(
			Dictionary.To((c) => c.ToString(), cells.Values().map((c) => c.GetHexCoo()))
		).GetAreas(new HexAxial(blueprint.CenterItem.Position.Q, blueprint.CenterItem.Position.R));
		this.SetLands(cells, blueprint.MapMode, areas);
		this.AddClouds();

		const departure = new HexAxial(blueprint.Goal.Departure.Position.Q, blueprint.Goal.Departure.Position.R);
		const arrival = new HexAxial(blueprint.Goal.Arrival.Position.Q, blueprint.Goal.Arrival.Position.R);
		const spots = [ departure, arrival ];

		this.SetHqLand(cells, SvgArchive.nature.hq, spots);
		this.SetHqLand(cells, SvgArchive.nature.hq2, spots, 1);

		const truck = new Truck(new Identity('player', new HqSkinHelper().GetSkin(0), true));
		truck.OverrideLife(1);
		truck.SetPosition(cells.Get(departure.ToString()));
		vehicles.push(truck);
		const arrivalCell = cells.Get(arrival.ToString());
		new AboveItem(arrivalCell, SvgArchive.arrow);

		const iaId = new Identity('ia', new HqSkinHelper().GetSkin(1), false);
		blueprint.Patrols.forEach((patrol) => {
			const tank = new Tank(iaId, false);
			const d = new HexAxial(patrol.Departure.Position.Q, patrol.Departure.Position.R);
			const a = new HexAxial(patrol.Arrival.Position.Q, patrol.Arrival.Position.R);
			const dCell = cells.Get(d.ToString());
			const aCell = cells.Get(a.ToString());
			tank.SetPosition(dCell);
			tank.GiveOrder(new PatrolOrder([ aCell, dCell ], tank));
			vehicles.push(tank);
		});

		return new CamouflageContext(gameState, cells.Values(), truck, vehicles, arrivalCell);
	}

	public AddClouds() {
		new Cloud(GameSettings.Size * 2, 20 * GameSettings.Size, -GameSettings.Size * 3, SvgArchive.nature.clouds[0]);
		new Cloud(-GameSettings.Size * 5, 20 * GameSettings.Size, -GameSettings.Size * 15, SvgArchive.nature.clouds[1]);
		new Cloud(GameSettings.Size * 8, 20 * GameSettings.Size, -GameSettings.Size * 13, SvgArchive.nature.clouds[2]);
		new Cloud(-GameSettings.Size * 12, 20 * GameSettings.Size, -GameSettings.Size * 8, SvgArchive.nature.clouds[3]);
		new Cloud(GameSettings.Size * 6, 20 * GameSettings.Size, -GameSettings.Size * 10, SvgArchive.nature.clouds[4]);
	}

	private SetLands(cells: Dictionary<Cell>, mode: MapKind, middleAreas: HexAxial[]) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner.ToString());
			const boundingBox = new BoundingBox();
			boundingBox.Width = GameSettings.Size * 6;
			boundingBox.Height = GameSettings.Size * 6;
			boundingBox.X = cell.GetBoundingBox().X - (boundingBox.Width / 2 - cell.GetBoundingBox().Width / 2);
			boundingBox.Y = cell.GetBoundingBox().Y - (boundingBox.Height / 2 - cell.GetBoundingBox().Height / 2);

			let floor = SvgArchive.nature.forest.floor;
			if (mode === MapKind.Ice) {
				floor = SvgArchive.nature.ice.floor;
			} else if (mode === MapKind.Sand) {
				floor = SvgArchive.nature.sand.floor;
			}

			const land = new Floor(boundingBox, floor);
			land.SetVisible(() => true);
			land.SetAlive(() => true);
		});
	}

	private SetHqLand(cells: Dictionary<Cell>, sprite: string, middleAreas: HexAxial[], z: number = 0) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner.ToString());
			const boundingBox = new BoundingBox();
			boundingBox.Width = GameSettings.Size * 6;
			boundingBox.Height = GameSettings.Size * 6;
			boundingBox.X = cell.GetBoundingBox().X - (boundingBox.Width / 2 - cell.GetBoundingBox().Width / 2);
			boundingBox.Y = cell.GetBoundingBox().Y - (boundingBox.Height / 2 - cell.GetBoundingBox().Height / 2);

			const land = new SimpleFloor(boundingBox, sprite, z);
			land.SetVisible(() => true);
			land.SetAlive(() => true);
		});
	}
}
