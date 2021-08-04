import { Tank } from '../../../Items/Unit/Tank';
import { FireBlueprint } from '../../Blueprint/Fire/FireBlueprint';
import { SvgArchive } from '../../SvgArchiver';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { Cell } from '../../../Items/Cell/Cell';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { Identity } from '../../../Items/Identity';
import { HqAppearance } from '../Hq/HqSkinHelper';
import { AboveItem } from '../../../Items/AboveItem';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';
import { GameState } from '../../World/GameState';
import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { ReactorField } from '../../../Items/Cell/Field/Bonus/ReactorField';
import { CellLessHeadquarter } from '../Fire/CellLessHeadquarter';
import { FireV2World } from '../../World/FireV2Context';
import { Landmaker } from '../Landmaker';
import { Cloudmaker } from '../Cloudmaker';
import { CellStateSetter } from '../../../Items/Cell/CellStateSetter';
import { CellState } from '../../../Items/Cell/CellState';

export class FireRendererV2 {
	public Render(blueprint: FireBlueprint, gameState: GameState): FireV2World {
		const id = new Identity('Player', HqAppearance.Skins.Get(ColorKind[ColorKind.Red]), true);
		const hq = new CellLessHeadquarter();
		hq.Identity = id;

		const cells = new Dictionary<Cell>();

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

		const goal = new HexAxial(blueprint.Goal.Coo.Q, blueprint.Goal.Coo.R);
		const targetCell = cells.Get(goal.ToString());

		const iaId = new Identity('IA', HqAppearance.Skins.Get(ColorKind[ColorKind.Blue]), false);
		const targetHq = new Headquarter(iaId, targetCell);
		targetCell.SetField(targetHq);
		new AboveItem(targetCell, SvgArchive.direction.target);

		let c = cells.Get(new HexAxial(5, 1).ToString());
		c.SetField(new ReactorField(c, targetHq, [ hq, targetHq ], targetHq.Identity.Skin.GetLight()));

		c = cells.Get(new HexAxial(0, 5).ToString());
		c.SetField(new ReactorField(c, targetHq, [ hq, targetHq ], targetHq.Identity.Skin.GetLight()));

		const arrival = new HexAxial(blueprint.Arrival.Coo.Q, blueprint.Arrival.Coo.R);
		const arrivalCell = cells.Get(arrival.ToString());

		const tank = new Tank(id);
		hq.AddVehicle(tank);
		tank.SetPosition(arrivalCell);

		cells.Values().forEach((cell) => {
			cell.SetPlayerHq(id);
			cell.Listen();
		});

		const world = new FireV2World(gameState, cells.Values(), tank, hq, targetHq);
		CellStateSetter.SetStates(world.GetCells());
		world.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});

		return world;
	}
}
