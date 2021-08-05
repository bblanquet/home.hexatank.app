import { Camouflageworld } from '../../World/Camouflageworld';
import { Tank } from '../../../Items/Unit/Tank';
import { SvgArchive } from '../../SvgArchiver';
import { AboveItem } from '../../../Items/AboveItem';
import { HqAppearance } from '../Hq/HqSkinHelper';
import { CamouflageBlueprint } from '../../Blueprint/Cam/CamouflageBlueprint';
import { GameSettings } from '../../GameSettings';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { Cell } from '../../../Items/Cell/Cell';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { Identity } from '../../../Items/Identity';
import { PatrolOrder } from '../../../Ia/Order/Composite/PatrolOrder';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';
import { GameState } from '../../World/GameState';
import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
import { Cloudmaker } from '../Cloudmaker';
import { Landmaker } from '../Landmaker';
import { HqLandmaker } from '../HqLandmaker';
import { CellState } from '../../../Items/Cell/CellState';
import { CellStateSetter } from '../../../Items/Cell/CellStateSetter';

export class CamouflageworldMaker {
	public Make(blueprint: CamouflageBlueprint, gameState: GameState): Camouflageworld {
		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		GameSettings.TranslatinDuration = 1000;

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
		new Landmaker().SetLands(cells, blueprint.MapMode, areas);
		new Cloudmaker().SetClouds(cells, areas);

		const departure = new HexAxial(blueprint.Goal.Departure.Coo.Q, blueprint.Goal.Departure.Coo.R);
		const arrival = new HexAxial(blueprint.Goal.Arrival.Coo.Q, blueprint.Goal.Arrival.Coo.R);
		const spots = [ departure, arrival ];

		new HqLandmaker().SetHqLand(cells, SvgArchive.nature.hq, spots);
		new HqLandmaker().SetHqLand(cells, SvgArchive.nature.hq2, spots, 1);

		const tank = new Tank(new Identity('player', HqAppearance.Skins.Get(ColorKind[ColorKind.Red]), true));
		tank.Id = 'tank';
		tank.OverrideLife(1);
		tank.SetPosition(cells.Get(departure.ToString()));
		vehicles.push(tank);
		const above = new AboveItem(tank, SvgArchive.hand);
		above.SetVisible(() => !tank.IsSelected());

		const arrivalCell = cells.Get(arrival.ToString());
		new AboveItem(arrivalCell, SvgArchive.arrow);

		const iaId = new Identity('ia', HqAppearance.Skins.Get(ColorKind[ColorKind.Blue]), false);
		blueprint.Patrols.forEach((patrol) => {
			const tank = new Tank(iaId, false);
			tank.Id = 'tank';
			const d = new HexAxial(patrol.Departure.Coo.Q, patrol.Departure.Coo.R);
			const a = new HexAxial(patrol.Arrival.Coo.Q, patrol.Arrival.Coo.R);
			const dCell = cells.Get(d.ToString());
			const aCell = cells.Get(a.ToString());
			tank.SetPosition(dCell);
			tank.GiveOrder(new PatrolOrder([ aCell, dCell ], tank));
			vehicles.push(tank);
		});

		const world = new Camouflageworld(
			gameState,
			cells.Values(),
			tank,
			vehicles,
			tank.GetCurrentCell(),
			arrivalCell
		);
		CellStateSetter.SetStates(world.GetCells());
		world.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});
		return world;
	}
}
