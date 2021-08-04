import { FakeHeadquarter } from './FakeHeadquarter';
import { Tank } from '../../../Items/Unit/Tank';
import { CellLessHeadquarter } from './CellLessHeadquarter';
import { HqLessShieldField } from '../../../Items/Cell/Field/Bonus/HqLessShieldField';
import { FireBlueprint } from '../../Blueprint/Fire/FireBlueprint';
import { Fireworld } from '../../World/Fireworld';
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
import { Cloudmaker } from '../Cloudmaker';
import { Landmaker } from '../Landmaker';
import { CellState } from '../../../Items/Cell/CellState';
import { CellStateSetter } from '../../../Items/Cell/CellStateSetter';

export class FireworldMaker {
	public Make(blueprint: FireBlueprint, gameState: GameState): Fireworld {
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
		const goalCell = cells.Get(goal.ToString());

		const iaId = new Identity('IA', HqAppearance.Skins.Get(ColorKind[ColorKind.Blue]), false);
		const shield = new HqLessShieldField(goalCell, iaId, new FakeHeadquarter());
		goalCell.SetField(shield);
		new AboveItem(goalCell, SvgArchive.arrow);

		const arrival = new HexAxial(blueprint.Arrival.Coo.Q, blueprint.Arrival.Coo.R);
		const arrivalCell = cells.Get(arrival.ToString());
		const id = new Identity('Player', HqAppearance.Skins.Get(ColorKind[ColorKind.Red]), true);
		const tank = new Tank(id);
		tank.SetPosition(arrivalCell);

		const hq = new CellLessHeadquarter();
		hq.Identity = id;
		hq.AddVehicle(tank);

		cells.Values().forEach((cell) => {
			cell.SetPlayerHq(id);
			cell.Listen();
		});

		const world = new Fireworld(gameState, cells.Values(), tank, hq, shield);
		CellStateSetter.SetStates(world.GetCells());
		world.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});
		return world;
	}
}
