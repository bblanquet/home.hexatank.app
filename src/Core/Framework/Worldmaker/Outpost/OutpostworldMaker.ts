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
import { CellLessHeadquarter } from '../Fire/CellLessHeadquarter';
import { Landmaker } from '../Landmaker';
import { Cloudmaker } from '../Cloudmaker';
import { CellStateSetter } from '../../../Items/Cell/CellStateSetter';
import { CellState } from '../../../Items/Cell/CellState';
import { GameSettings } from '../../GameSettings';
import { Outpostworld } from '../../World/Outpostworld';
import { BasicField } from '../../../Items/Cell/Field/BasicField';
import { ReactorField } from '../../../Items/Cell/Field/Bonus/ReactorField';
import { BlockingField } from '../../../Items/Cell/Field/BlockingField';

export class OutpostworlddMaker {
	public Make(blueprint: FireBlueprint, gameState: GameState): Outpostworld {
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

		const arrival = new HexAxial(blueprint.Departure.Coo.Q, blueprint.Departure.Coo.R);
		const arrivalCell = cells.Get(arrival.ToString());

		cells.Values().forEach((cell) => {
			cell.SetPlayerHq(id);
			cell.Listen();
		});

		const tank = new Tank(id);
		tank.Id = 'Tank';
		hq.AddVehicle(tank);
		tank.SetPosition(arrivalCell);
		tank.SetDamage(5);

		const reactorCell = cells.Get(new HexAxial(0, 1).ToString());
		if (!(reactorCell.GetField() instanceof BasicField)) {
			reactorCell.GetField().Destroy();
		}
		const above = new AboveItem(reactorCell, SvgArchive.hand);
		above.SetVisible(() => reactorCell.GetField() instanceof BasicField);

		const batteryCell = cells.Get(new HexAxial(1, 1).ToString());
		if (!(batteryCell.GetField() instanceof BasicField)) {
			batteryCell.GetField().Destroy();
		}
		const above2 = new AboveItem(batteryCell, SvgArchive.hand);
		above2.SetVisible(
			() => batteryCell.GetField() instanceof BasicField && reactorCell.GetField() instanceof ReactorField
		);

		let c = cells.Get(new HexAxial(-1, 2).ToString());
		if (!(c.GetField() instanceof BasicField)) {
			c.GetField().Destroy();
		}

		c = cells.Get(new HexAxial(0, 2).ToString());
		const boulder = new BlockingField(c, SvgArchive.nature.forest.rock);

		if (!(c.GetField() instanceof BasicField)) {
			c.GetField().Destroy();
			c.SetField(boulder);
		}

		const world = new Outpostworld(gameState, cells.Values(), hq, tank, batteryCell, boulder);
		CellStateSetter.SetStates(world.GetCells());
		world.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});

		return world;
	}
}
