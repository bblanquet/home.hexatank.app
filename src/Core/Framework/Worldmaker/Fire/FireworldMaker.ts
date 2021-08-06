import { Tank } from '../../../Items/Unit/Tank';
import { SmallBlueprint } from '../../Blueprint/Small/SmallBlueprint';
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
import { CellLessHeadquarter } from '../CellLessHeadquarter';
import { Fireworld } from '../../World/Fireworld';
import { Landmaker } from '../Landmaker';
import { Cloudmaker } from '../Cloudmaker';
import { CellStateSetter } from '../../../Items/Cell/CellStateSetter';
import { CellState } from '../../../Items/Cell/CellState';
import { GameSettings } from '../../GameSettings';
import { HqLandmaker } from '../HqLandmaker';
import { BatteryField } from '../../../Items/Cell/Field/Bonus/BatteryField';
import { ShieldField } from '../../../Items/Cell/Field/Bonus/ShieldField';

export class FireworldMaker {
	public Make(blueprint: SmallBlueprint, gameState: GameState): Fireworld {
		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		GameSettings.TranslatinDuration = 1000;
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
		targetHq.OverrideLife(10);
		targetCell.SetField(targetHq);
		new AboveItem(targetCell, SvgArchive.direction.target);

		[ new HexAxial(0, 5), new HexAxial(5, 1) ].forEach((h) => {
			let c = cells.Get(h.ToString());
			c.SetField(new ReactorField(c, targetHq, [ hq, targetHq ], targetHq.Identity.Skin.GetLight()));
			new AboveItem(c, SvgArchive.arrow);
		});

		[ new HexAxial(0, 6), new HexAxial(-1, 6), new HexAxial(6, 1), new HexAxial(6, 0) ].forEach((h) => {
			let c = cells.Get(h.ToString());
			let r = new BatteryField(cells.Get(h.ToString()), targetHq);
			c.SetField(r);
		});

		[
			new HexAxial(1, 5),
			new HexAxial(1, 4),
			new HexAxial(2, 3),
			new HexAxial(3, 2),
			new HexAxial(4, 2),
			new HexAxial(5, 2)
		].forEach((h) => {
			let c = cells.Get(h.ToString());
			c.SetField(new ShieldField(cells.Get(h.ToString()), targetHq.Identity, targetHq));
		});

		const arrival = new HexAxial(blueprint.Departure.Coo.Q, blueprint.Departure.Coo.R);
		const arrivalCell = cells.Get(arrival.ToString());

		new HqLandmaker().SetHqLand(cells, SvgArchive.nature.hq, [ targetCell.GetHexCoo() ]);
		new HqLandmaker().SetHqLand(cells, SvgArchive.nature.hq2, [ targetCell.GetHexCoo() ], 1);

		cells.Values().forEach((cell) => {
			cell.SetPlayerHq(id);
			cell.Listen();
		});

		const tank = new Tank(id);
		hq.AddVehicle(tank);
		tank.SetPosition(arrivalCell);
		const above = new AboveItem(tank, SvgArchive.hand);
		above.SetVisible(() => !tank.IsSelected());

		const world = new Fireworld(gameState, cells.Values(), tank, hq, targetHq, [
			cells.Get(blueprint.Goal.Coo.ToString()),
			cells.Get(new HexAxial(0, 6).ToString()),
			cells.Get(blueprint.Departure.Coo.ToString())
		]);
		CellStateSetter.SetStates(world.GetCells());
		world.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});

		return world;
	}
}
