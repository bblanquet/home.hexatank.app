import { SimpleFloor } from './../../Items/Environment/SimpleFloor';
import { CellContext } from './../../Items/Cell/CellContext';
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
import { AbstractHqRender } from './Hq/AbstractHqRender';

export class MapRender {
	public Render(hqRender: AbstractHqRender, mapContext: MapContext): GameContext {
		const cells = new CellContext<Cell>();
		const context = new GameContext();
		const playgroundItems = new Array<Item>();

		mapContext.Items.forEach((item) => {
			let cell = new Cell(new CellProperties(new HexAxial(item.Position.Q, item.Position.R)), cells, context);
			ForestDecorator.SetDecoration(playgroundItems, cell, item.Type);
			cell.SetSprite();
			cells.Add(cell);
			playgroundItems.push(cell);
		});

		let areas = new AreaSearch(cells.Keys()).GetAreas(
			new HexAxial(mapContext.CenterItem.Position.Q, mapContext.CenterItem.Position.R)
		);
		this.SetLands(cells, mapContext.MapMode, areas, playgroundItems);
		this.AddClouds(playgroundItems);
		const hqs = hqRender.GetHq(context, cells, mapContext.Hqs, playgroundItems);

		let playerHq = hqs.find((hq) => hq.PlayerName === mapContext.PlayerName);

		//insert elements into playground
		this.SetHqLands(cells, Archive.nature.hq, hqs.map((h) => h.GetCell().GetHexCoo()), playgroundItems);
		this.SetHqLands(cells, Archive.nature.hq2, hqs.map((h) => h.GetCell().GetHexCoo()), playgroundItems, 1);

		context.Setup(mapContext, playerHq, hqs, cells.All());
		//make hq cells visible, need context to be setup :<, has to fix it one day
		playerHq.GetCurrentCell().SetState(CellState.Visible);
		playerHq.GetCurrentCell().GetAllNeighbourhood().forEach((cell) => {
			(<Cell>cell).SetState(CellState.Visible);
		});
		return context;
	}

	public AddClouds(items: Item[]) {
		items.push(new Cloud(200, 20 * GameSettings.Size, 800, Archive.nature.clouds[0]));
		items.push(new Cloud(400, 20 * GameSettings.Size, 1200, Archive.nature.clouds[1]));
		items.push(new Cloud(600, 20 * GameSettings.Size, 1600, Archive.nature.clouds[2]));
		items.push(new Cloud(800, 20 * GameSettings.Size, 800, Archive.nature.clouds[3]));
		items.push(new Cloud(1200, 20 * GameSettings.Size, 1600, Archive.nature.clouds[4]));
	}

	private SetLands(cells: CellContext<Cell>, mode: MapEnv, middleAreas: HexAxial[], items: Item[]) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner);
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

	private SetHqLands(
		cells: CellContext<Cell>,
		sprite: string,
		middleAreas: HexAxial[],
		items: Item[],
		z: number = 0
	) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner);
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
