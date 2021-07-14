import { FakeHeadquarter } from './FakeHeadquarter';
import { Tank } from '../../../Items/Unit/Tank';
import { CellLessHeadquarter } from './CellLessHeadquarter';
import { HqLessShieldField } from '../../../Items/Cell/Field/Bonus/HqLessShieldField';
import { FireBlueprint } from '../../Blueprint/Fire/FireBlueprint';
import { FireContext } from '../../Context/FireContext';
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
import { GameState } from '../../Context/GameState';
import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
import { CloudRender } from '../CloudRender';
import { LandRender } from '../LandRender';

export class FireRenderer {
	public Render(blueprint: FireBlueprint, gameState: GameState): FireContext {
		const cells = new Dictionary<Cell>();

		blueprint.Cells.forEach((item) => {
			const cell = new Cell(new CellProperties(new HexAxial(item.Position.Q, item.Position.R)), cells);
			Decorator.Decorate(cell, item.Type);
			cell.InitSprite();
			cells.Add(cell.Coo(), cell);
		});

		const areas = new AreaSearch(
			Dictionary.To((c) => c.ToString(), cells.Values().map((c) => c.GetHexCoo()))
		).GetAreas(new HexAxial(blueprint.CenterItem.Position.Q, blueprint.CenterItem.Position.R));
		new LandRender().SetLands(cells, blueprint.MapMode, areas);
		new CloudRender().SetClouds(cells, areas);

		const goal = new HexAxial(blueprint.Goal.Position.Q, blueprint.Goal.Position.R);
		const goalCell = cells.Get(goal.ToString());

		const iaId = new Identity('IA', HqAppearance.Skins.Get(ColorKind[ColorKind.Blue]), false);
		const shield = new HqLessShieldField(goalCell, iaId, new FakeHeadquarter());
		goalCell.SetField(shield);
		new AboveItem(goalCell, SvgArchive.arrow);

		const arrival = new HexAxial(blueprint.Arrival.Position.Q, blueprint.Arrival.Position.R);
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

		return new FireContext(gameState, cells.Values(), tank, hq, shield);
	}
}
