import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { SimpleFloor } from '../../../Items/Environment/SimpleFloor';
import { GameContext } from '../../Context/GameContext';
import { GameSettings } from '../../../Framework/GameSettings';
import { ForestDecorator } from '../../../Items/Cell/Decorator/ForestDecorator';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { Cloud } from '../../../Items/Environment/Cloud';
import { CellState } from '../../../Items/Cell/CellState';
import { Cell } from '../../../Items/Cell/Cell';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { Floor } from '../../../Items/Environment/Floor';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { GameBlueprint } from '../../Blueprint/Game/GameBlueprint';
import { MapEnv } from '../../Blueprint/Items/MapEnv';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { HqRender } from '../Hq/HqRender';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
export class GameRenderer {
	public Render(blueprint: GameBlueprint): GameContext {
		const cells = new Dictionary<Cell>();
		let playerHq: Headquarter = null;
		let hqs: Headquarter[] = [];

		blueprint.Items.forEach((item) => {
			const cell = new Cell(new CellProperties(new HexAxial(item.Position.Q, item.Position.R)), cells);
			ForestDecorator.SetDecoration(cell, item.Type);
			cell.InitSprite();
			cells.Add(cell.Coo(), cell);
		});

		const areas = new AreaSearch(
			Dictionary.To((c) => c.ToString(), cells.Values().map((c) => c.GetHexCoo()))
		).GetAreas(new HexAxial(blueprint.CenterItem.Position.Q, blueprint.CenterItem.Position.R));
		this.SetLands(cells, blueprint.MapMode, areas);
		this.AddClouds();
		if (blueprint.Hqs) {
			blueprint.Hqs.forEach((hq, index) => {
				hqs.push(new HqRender().Render(cells, hq, index));
			});

			//insert elements into playground
			this.SetHqLand(cells, SvgArchive.nature.hq, hqs.map((h) => h.GetCell().GetHexCoo()));
			this.SetHqLand(cells, SvgArchive.nature.hq2, hqs.map((h) => h.GetCell().GetHexCoo()), 1);

			playerHq = hqs.find((hq) => hq.Identity.Name === blueprint.PlayerName);
			if (playerHq) {
				playerHq.SetSelectionAnimation();
				cells.Values().forEach((cell) => {
					cell.SetPlayerHq(playerHq);
					cell.Listen();
				});
				//make hq cells visible, need context to be setup :<, has to fix it one day
				playerHq.GetCurrentCell().SetState(CellState.Visible);
				playerHq.GetCurrentCell().GetNearby().forEach((cell) => {
					(<Cell>cell).SetState(CellState.Visible);
				});
			}
		}

		return new GameContext(cells.Values(), hqs, playerHq);
	}

	public AddClouds() {
		new Cloud(200, 20 * GameSettings.Size, 800, SvgArchive.nature.clouds[0]);
		new Cloud(400, 20 * GameSettings.Size, 1200, SvgArchive.nature.clouds[1]);
		new Cloud(600, 20 * GameSettings.Size, 1600, SvgArchive.nature.clouds[2]);
		new Cloud(800, 20 * GameSettings.Size, 800, SvgArchive.nature.clouds[3]);
		new Cloud(1200, 20 * GameSettings.Size, 1600, SvgArchive.nature.clouds[4]);
	}

	private SetLands(cells: Dictionary<Cell>, mode: MapEnv, middleAreas: HexAxial[]) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner.ToString());
			const boundingBox = new BoundingBox();
			boundingBox.Width = GameSettings.Size * 6;
			boundingBox.Height = GameSettings.Size * 6;
			boundingBox.X = cell.GetBoundingBox().X - (boundingBox.Width / 2 - cell.GetBoundingBox().Width / 2);
			boundingBox.Y = cell.GetBoundingBox().Y - (boundingBox.Height / 2 - cell.GetBoundingBox().Height / 2);

			let floor = SvgArchive.nature.forest;
			if (mode === MapEnv.ice) {
				floor = SvgArchive.nature.ice;
			} else if (mode === MapEnv.sand) {
				floor = SvgArchive.nature.sand;
			}

			const land = new Floor(boundingBox, floor);
			land.SetVisible(() => true);
			land.SetAlive(() => true);
		});
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
