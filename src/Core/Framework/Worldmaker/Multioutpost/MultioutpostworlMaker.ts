import { FakeHeadquarter } from '../FakeHeadquarter';
import { Tank } from '../../../Items/Unit/Tank';
import { CellLessHeadquarter } from '../CellLessHeadquarter';
import { HqLessShieldField } from '../../../Items/Cell/Field/Bonus/HqLessShieldField';
import { SmallBlueprint } from '../../Blueprint/Small/SmallBlueprint';
import { Multioutpostworld } from '../../World/Multioutpostworld';
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
import { GameSettings } from '../../GameSettings';
import { ReactorField } from '../../../Items/Cell/Field/Bonus/ReactorField';
import { BatteryField } from '../../../Items/Cell/Field/Bonus/BatteryField';
import { BasicField } from '../../../Items/Cell/Field/BasicField';
import { ShieldField } from '../../../Items/Cell/Field/Bonus/ShieldField';
import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';

export class MultioutpostworlMaker {
	public Make(blueprint: SmallBlueprint, gameState: GameState): Multioutpostworld {
		const id = new Identity('Player', HqAppearance.Skins.Get(ColorKind[ColorKind.Red]), true);

		GameSettings.Init();
		GameSettings.SetNormalSpeed();
		const cells = new Dictionary<Cell>();

		blueprint.Cells.forEach((item) => {
			const cell = new Cell(new CellProperties(new HexAxial(item.Coo.Q, item.Coo.R)), cells);
			Decorator.Decorate(cell, item.Type);
			cell.InitSprite();
			cells.Add(cell.Coo(), cell);
		});

		cells.Values().forEach((cell) => {
			cell.SetPlayerHq(id);
			cell.Listen();
		});

		const areas = new AreaSearch(
			Dictionary.To((c) => c.ToString(), cells.Values().map((c) => c.GetHexCoo()))
		).GetAreas(new HexAxial(blueprint.CenterItem.Coo.Q, blueprint.CenterItem.Coo.R));
		new Landmaker().SetLands(cells, blueprint.MapMode, areas);
		new Cloudmaker().SetClouds(cells, areas);

		const arrival = new HexAxial(blueprint.Departure.Coo.Q, blueprint.Departure.Coo.R);
		const arrivalCell = cells.Get(arrival.ToString());
		const tank = new Tank(id);
		tank.Id = 'tank';
		tank.SetPosition(arrivalCell);

		const hq = new CellLessHeadquarter();
		hq.Identity = id;
		hq.AddVehicle(tank);

		const r = new Array<Cell>();
		[ new HexAxial(-1, 3), new HexAxial(5, 1) ].forEach((h) => {
			let c = cells.Get(h.ToString());
			r.push(c);
			c.SetField(new ReactorField(c, hq, [ hq ], hq.Identity.Skin.GetLight()));
		});

		[
			new HexAxial(-2, 4),
			new HexAxial(-2, 3),
			new HexAxial(-1, 2),
			new HexAxial(-1, 4),
			new HexAxial(0, 2),
			new HexAxial(0, 3)
		].forEach((h) => {
			let c = cells.Get(h.ToString());
			let r = new BatteryField(cells.Get(h.ToString()), hq);
			c.SetField(r);
		});

		const fireCell = cells.Get(new HexAxial(2, 2).ToString());
		if (!(fireCell.GetField() instanceof BasicField)) {
			fireCell.GetField().Destroy();
		}

		[ new HexAxial(5, 2) ].forEach((h) => {
			let c = cells.Get(h.ToString());
			let r = new ShieldField(cells.Get(h.ToString()), hq.Identity, hq);
			c.SetField(r);
		});

		[ new HexAxial(4, 1) ].forEach((h) => {
			let c = cells.Get(h.ToString());
			let r = new MedicField(cells.Get(h.ToString()), hq);
			c.SetField(r);
		});

		const world = new Multioutpostworld(gameState, cells.Values(), tank, hq, fireCell, r[0], r[1]);
		CellStateSetter.SetStates(world.GetCells());
		world.GetCells().forEach((c) => {
			c.SetState(CellState.Visible);
			c.AlwaysVisible();
		});
		return world;
	}
}
