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
import { GameState } from '../../Context/GameState';
import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
import { CloudRender } from '../CloudRender';
import { LandRender } from '../LandRender';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { ReactorField } from '../../../Items/Cell/Field/Bonus/ReactorField';
import { CellLessHeadquarter } from '../Fire/CellLessHeadquarter';
import { FireV2Context } from '../../Context/FireV2Context';

export class FireRendererV2 {
	public Render(blueprint: FireBlueprint, gameState: GameState): FireV2Context {
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
		new LandRender().SetLands(cells, blueprint.MapMode, areas);
		new CloudRender().SetClouds(cells, areas);

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

		return new FireV2Context(gameState, cells.Values(), tank, hq, targetHq);
	}
}
