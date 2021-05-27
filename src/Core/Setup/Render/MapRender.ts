import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { SimpleFloor } from './../../Items/Environment/SimpleFloor';
import { GameContext } from './../../Framework/GameContext';
import { GameSettings } from '../../Framework/GameSettings';
import { ForestDecorator } from '../../Items/Cell/Decorator/ForestDecorator';
import { CellProperties } from '../../Items/Cell/CellProperties';
import { Cloud } from '../../Items/Environment/Cloud';
import { CellState } from '../../Items/Cell/CellState';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { Floor } from '../../Items/Environment/Floor';
import { Archive } from '../../Framework/ResourceArchiver';
import { MapContext } from '../Generator/MapContext';
import { MapEnv } from '../Generator/MapEnv';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { HqRender } from './Hq/HqRender';
export class MapRender {
	public Render(mapContext: MapContext): GameContext {
		const cells = new Dictionnary<Cell>();
		const context = new GameContext();
		const updatableItem = new Array<Item>();

		mapContext.Items.forEach((item) => {
			const cell = new Cell(new CellProperties(new HexAxial(item.Position.Q, item.Position.R)), cells, context);
			ForestDecorator.SetDecoration(updatableItem, cell, item.Type);
			cell.SetSprite();
			cells.Add(cell.Coo(), cell);
			updatableItem.push(cell);
		});

		const areas = new AreaSearch(
			Dictionnary.To((c) => c.ToString(), cells.Values().map((c) => c.GetHexCoo()))
		).GetAreas(new HexAxial(mapContext.CenterItem.Position.Q, mapContext.CenterItem.Position.R));
		this.SetLands(cells, mapContext.MapMode, areas, updatableItem);
		this.AddClouds(updatableItem);
		const hqs = new HqRender().Render(cells, mapContext.Hqs, updatableItem);

		//insert elements into playground
		this.SetHqLand(cells, Archive.nature.hq, hqs.map((h) => h.GetCell().GetHexCoo()), updatableItem);
		this.SetHqLand(cells, Archive.nature.hq2, hqs.map((h) => h.GetCell().GetHexCoo()), updatableItem, 1);

		const playerHq = hqs.find((hq) => hq.PlayerName === mapContext.PlayerName);
		if (playerHq) {
			playerHq.SetSelectionAnimation();
			context.Setup(mapContext, hqs, cells.Values(), playerHq);
			//make hq cells visible, need context to be setup :<, has to fix it one day
			playerHq.GetCurrentCell().SetState(CellState.Visible);
			playerHq.GetCurrentCell().GetAllNeighbourhood().forEach((cell) => {
				(<Cell>cell).SetState(CellState.Visible);
			});
		} else {
			context.Setup(mapContext, hqs, cells.Values());
		}

		return context;
	}

	public AddClouds(items: Item[]) {
		items.push(new Cloud(200, 20 * GameSettings.Size, 800, Archive.nature.clouds[0]));
		items.push(new Cloud(400, 20 * GameSettings.Size, 1200, Archive.nature.clouds[1]));
		items.push(new Cloud(600, 20 * GameSettings.Size, 1600, Archive.nature.clouds[2]));
		items.push(new Cloud(800, 20 * GameSettings.Size, 800, Archive.nature.clouds[3]));
		items.push(new Cloud(1200, 20 * GameSettings.Size, 1600, Archive.nature.clouds[4]));
	}

	private SetLands(cells: Dictionnary<Cell>, mode: MapEnv, middleAreas: HexAxial[], items: Item[]) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner.ToString());
			const boundingBox = new BoundingBox();
			boundingBox.Width = GameSettings.Size * 6;
			boundingBox.Height = GameSettings.Size * 6;
			boundingBox.X = cell.GetBoundingBox().X - (boundingBox.Width / 2 - cell.GetBoundingBox().Width / 2);
			boundingBox.Y = cell.GetBoundingBox().Y - (boundingBox.Height / 2 - cell.GetBoundingBox().Height / 2);

			let floor = Archive.nature.forest;
			if (mode === MapEnv.ice) {
				floor = Archive.nature.ice;
			} else if (mode === MapEnv.sand) {
				floor = Archive.nature.sand;
			}

			const land = new Floor(boundingBox, floor);
			land.SetVisible(() => true);
			land.SetAlive(() => true);
			items.push(land);
		});
	}

	private SetHqLand(cells: Dictionnary<Cell>, sprite: string, middleAreas: HexAxial[], items: Item[], z: number = 0) {
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
			items.push(land);
		});
	}
}
