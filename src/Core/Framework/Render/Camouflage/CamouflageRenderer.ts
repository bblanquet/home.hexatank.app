import { CamouflageContext } from '../../Context/CamouflageContext';
import { Tank } from '../../../Items/Unit/Tank';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { AboveItem } from '../../../Items/AboveItem';
import { HqAppearance } from '../Hq/HqSkinHelper';
import { Truck } from '../../../Items/Unit/Truck';
import { SimpleFloor } from '../../../Items/Environment/SimpleFloor';
import { CamouflageBlueprint } from '../../Blueprint/Cam/CamouflageBlueprint';
import { GameSettings } from '../../../Framework/GameSettings';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { Cell } from '../../../Items/Cell/Cell';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { Identity } from '../../../Items/Identity';
import { PatrolOrder } from '../../../Ia/Order/Composite/PatrolOrder';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';
import { GameState } from '../../Context/GameState';
import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
import { CloudRender } from '../CloudRender';
import { LandRender } from '../LandRender';

export class CamouflageRenderer {
	public Render(blueprint: CamouflageBlueprint, gameState: GameState): CamouflageContext {
		const cells = new Dictionary<Cell>();
		const vehicles = new Array<Vehicle>();

		blueprint.Cells.forEach((item) => {
			const cell = new Cell(new CellProperties(new HexAxial(item.Coo.Q, item.Coo.R)), cells);
			Decorator.Decorate(cell, item.Type);
			cell.InitSprite();
			cells.Add(cell.Coo(), cell);
		});

		const areas = new AreaSearch(
			Dictionary.To((c) => c.ToString(), cells.Values().map((c) => c.GetHexCoo()))
		).GetAreas(new HexAxial(blueprint.CenterItem.Coo.Q, blueprint.CenterItem.Coo.R));
		new LandRender().SetLands(cells, blueprint.MapMode, areas);
		new CloudRender().SetClouds(cells, areas);

		const departure = new HexAxial(blueprint.Goal.Departure.Coo.Q, blueprint.Goal.Departure.Coo.R);
		const arrival = new HexAxial(blueprint.Goal.Arrival.Coo.Q, blueprint.Goal.Arrival.Coo.R);
		const spots = [ departure, arrival ];

		this.SetHqLand(cells, SvgArchive.nature.hq, spots);
		this.SetHqLand(cells, SvgArchive.nature.hq2, spots, 1);

		const truck = new Tank(new Identity('player', HqAppearance.Skins.Get(ColorKind[ColorKind.Red]), true));
		truck.OverrideLife(1);
		truck.SetPosition(cells.Get(departure.ToString()));
		vehicles.push(truck);
		const arrivalCell = cells.Get(arrival.ToString());
		new AboveItem(arrivalCell, SvgArchive.arrow);

		const iaId = new Identity('ia', HqAppearance.Skins.Get(ColorKind[ColorKind.Blue]), false);
		blueprint.Patrols.forEach((patrol) => {
			const tank = new Tank(iaId, false);
			const d = new HexAxial(patrol.Departure.Coo.Q, patrol.Departure.Coo.R);
			const a = new HexAxial(patrol.Arrival.Coo.Q, patrol.Arrival.Coo.R);
			const dCell = cells.Get(d.ToString());
			const aCell = cells.Get(a.ToString());
			tank.SetPosition(dCell);
			tank.GiveOrder(new PatrolOrder([ aCell, dCell ], tank));
			vehicles.push(tank);
		});

		return new CamouflageContext(gameState, cells.Values(), truck, vehicles, arrivalCell);
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
