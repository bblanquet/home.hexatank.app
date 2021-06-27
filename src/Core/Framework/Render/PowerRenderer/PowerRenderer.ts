import { FakeHeadquarter } from './FakeHeadquarter';
import { Tank } from './../../../Items/Unit/Tank';
import { CellLessHeadquarter } from './CellLessHeadquarter';
import { HqLessShieldField } from './../../../Items/Cell/Field/Bonus/HqLessShieldField';
import { PowerBlueprint } from './../../Blueprint/Power/PowerBlueprint';
import { PowerContext } from './../../Context/PowerContext';
import { SvgArchive } from './../../../Framework/SvgArchiver';
import { Cloud } from './../../../Items/Environment/Cloud';
import { DecoratingFactory } from '../../../Items/Cell/Decorator/ForestFactory';
import { GameSettings } from '../../../Framework/GameSettings';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { Cell } from '../../../Items/Cell/Cell';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { MapKind } from '../../Blueprint/Items/MapKind';
import { Floor } from '../../../Items/Environment/Floor';
import { Identity } from '../../../Items/Identity';
import { HqSkinHelper } from '../Hq/HqSkinHelper';
import { AboveItem } from '../../../Items/AboveItem';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';

export class PowerRenderer {
	public Render(blueprint: PowerBlueprint): PowerContext {
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
		this.SetLands(cells, blueprint.MapMode, areas);
		this.AddClouds();

		const goal = new HexAxial(blueprint.Goal.Position.Q, blueprint.Goal.Position.R);
		const goalCell = cells.Get(goal.ToString());

		const iaId = new Identity('IA', new HqSkinHelper().GetSkin(0), false);
		const shield = new HqLessShieldField(goalCell, iaId, new FakeHeadquarter());
		goalCell.SetField(shield);
		new AboveItem(goalCell, SvgArchive.arrow);

		const arrival = new HexAxial(blueprint.Arrival.Position.Q, blueprint.Arrival.Position.R);
		const arrivalCell = cells.Get(arrival.ToString());
		const id = new Identity('Player', new HqSkinHelper().GetSkin(1), true);
		const tank = new Tank(id);
		tank.SetPosition(arrivalCell);

		const hq = new CellLessHeadquarter();
		hq.Identity = iaId;

		cells.Values().forEach((cell) => cell.SetPlayerHq(hq));

		return new PowerContext(cells.Values(), tank, hq, shield);
	}

	public AddClouds() {
		new Cloud(200, 20 * GameSettings.Size, 800, SvgArchive.nature.clouds[0]);
		new Cloud(400, 20 * GameSettings.Size, 1200, SvgArchive.nature.clouds[1]);
		new Cloud(600, 20 * GameSettings.Size, 1600, SvgArchive.nature.clouds[2]);
		new Cloud(800, 20 * GameSettings.Size, 800, SvgArchive.nature.clouds[3]);
		new Cloud(1200, 20 * GameSettings.Size, 1600, SvgArchive.nature.clouds[4]);
	}

	private SetLands(cells: Dictionary<Cell>, mode: MapKind, middleAreas: HexAxial[]) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner.ToString());
			const boundingBox = new BoundingBox();
			boundingBox.Width = GameSettings.Size * 6;
			boundingBox.Height = GameSettings.Size * 6;
			boundingBox.X = cell.GetBoundingBox().X - (boundingBox.Width / 2 - cell.GetBoundingBox().Width / 2);
			boundingBox.Y = cell.GetBoundingBox().Y - (boundingBox.Height / 2 - cell.GetBoundingBox().Height / 2);

			let floor = SvgArchive.nature.forest;
			if (mode === MapKind.ice) {
				floor = SvgArchive.nature.ice;
			} else if (mode === MapKind.sand) {
				floor = SvgArchive.nature.sand;
			}

			const land = new Floor(boundingBox, floor);
			land.SetVisible(() => true);
			land.SetAlive(() => true);
		});
	}
}
