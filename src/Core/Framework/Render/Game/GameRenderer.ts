import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { SimpleFloor } from '../../../Items/Environment/SimpleFloor';
import { GameContext } from '../../Context/GameContext';
import { GameSettings } from '../../../Framework/GameSettings';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { CellState } from '../../../Items/Cell/CellState';
import { Cell } from '../../../Items/Cell/Cell';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { GameBlueprint } from '../../Blueprint/Game/GameBlueprint';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { HqRender } from '../Hq/HqRender';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';
import { GameState } from '../../Context/GameState';
import { LandRender } from '../LandRender';
import { CloudRender } from '../CloudRender';

export class GameRenderer {
	public Render(blueprint: GameBlueprint, gameState: GameState): GameContext {
		const cells = new Dictionary<Cell>();
		let playerHq: Headquarter = null;
		let hqs: Headquarter[] = [];

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
		if (blueprint.Hqs) {
			blueprint.Hqs.forEach((hq) => {
				hqs.push(new HqRender().Render(cells, hq));
			});

			//insert elements into playground
			this.SetHqLand(cells, SvgArchive.nature.hq, hqs.map((h) => h.GetCell().GetHexCoo()));
			this.SetHqLand(cells, SvgArchive.nature.hq2, hqs.map((h) => h.GetCell().GetHexCoo()), 1);

			playerHq = hqs.find((hq) => hq.Identity.Name === blueprint.PlayerName);
			if (playerHq) {
				playerHq.SetSelectionAnimation();
				cells.Values().forEach((cell) => {
					cell.SetPlayerHq(playerHq.Identity);
					cell.Listen();
				});
				//make hq cells visible, need context to be setup :<, has to fix it one day
				playerHq.GetCurrentCell().SetState(CellState.Visible);
				playerHq.GetCurrentCell().GetNearby().forEach((cell) => {
					cell.SetState(CellState.Visible);
				});
			}
		}

		return new GameContext(gameState, cells.Values(), hqs, playerHq);
	}

	private SetHqLand(cells: Dictionary<Cell>, sprite: string, middleAreas: HexAxial[], z: number = 0) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner.ToString());
			const boundingBox = new BoundingBox();
			boundingBox.SetWidth(GameSettings.Size * 6);
			boundingBox.SetHeight(GameSettings.Size * 6);
			boundingBox.SetX(
				cell.GetBoundingBox().GetX() - (boundingBox.GetWidth() / 2 - cell.GetBoundingBox().GetWidth() / 2)
			);
			boundingBox.SetY(
				cell.GetBoundingBox().GetY() - (boundingBox.GetHeight() / 2 - cell.GetBoundingBox().GetHeight() / 2)
			);
			const land = new SimpleFloor(boundingBox, sprite, z);
			land.SetVisible(() => true);
			land.SetAlive(() => true);
		});
	}
}
