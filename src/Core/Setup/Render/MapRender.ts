import { SimpleFloor } from './../../Items/Environment/SimpleFloor';
import { CellContext } from './../../Items/Cell/CellContext';
import { GameContext } from './../../Framework/GameContext';
import { GameSettings } from '../../Framework/GameSettings';
import { ForestDecorator } from '../../Items/Cell/Decorator/ForestDecorator';
import { CellProperties } from '../../Items/Cell/CellProperties';
import { Cloud } from '../../Items/Environment/Cloud';
import { HqRender } from './HqRender';
import { CellState } from '../../Items/Cell/CellState';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { Floor } from '../../Items/Environment/Floor';
import { Archive } from '../../Framework/ResourceArchiver';
import { MapContext } from '../Generator/MapContext';
import { MapMode } from '../Generator/MapMode';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';

export class MapRender {
	private _hqRender: HqRender;

	constructor() {
		this._hqRender = new HqRender();
	}

	public Render(mapContext: MapContext): GameContext {
		const cells = new CellContext<Cell>();
		const context = new GameContext();

		GameSettings.MapSize = mapContext.Items.length;

		let playgroundItems = new Array<Item>();

		mapContext.Items.forEach((item) => {
			let cell = new Cell(new CellProperties(item.Position), cells, context);
			ForestDecorator.SetDecoration(playgroundItems, cell, item.Type);
			cell.SetSprite();
			cells.Add(cell);
			playgroundItems.push(cell);
		});

		let areas = new AreaSearch(cells.Keys()).GetAreas(mapContext.CenterItem.Position);
		this.SetLands(cells, mapContext.MapMode, areas, playgroundItems);
		this.AddClouds(playgroundItems);
		const hqs = this._hqRender.GetHq(context, cells, mapContext.Hqs, playgroundItems);

		let playerHq = hqs.find((hq) => hq.PlayerName === mapContext.PlayerName);
		//make hq cells visible
		playerHq.GetCurrentCell().SetState(CellState.Visible);
		playerHq.GetCurrentCell().GetAllNeighbourhood().forEach((cell) => {
			(<Cell>cell).SetState(CellState.Visible);
		});

		//insert elements into playground
		this.SetHqLands(cells, Archive.nature.hq, hqs.map((h) => h.GetCell().GetCoordinate()), playgroundItems);
		this.SetHqLands(cells, Archive.nature.hq2, hqs.map((h) => h.GetCell().GetCoordinate()), playgroundItems, 1);

		context.Setup(playerHq, hqs, cells.All());
		return context;
	}

	public AddClouds(items: Item[]) {
		items.push(new Cloud(200, 20 * GameSettings.Size, 800, Archive.nature.clouds[0]));
		items.push(new Cloud(400, 20 * GameSettings.Size, 1200, Archive.nature.clouds[1]));
		items.push(new Cloud(600, 20 * GameSettings.Size, 1600, Archive.nature.clouds[2]));
		items.push(new Cloud(800, 20 * GameSettings.Size, 800, Archive.nature.clouds[3]));
		items.push(new Cloud(1200, 20 * GameSettings.Size, 1600, Archive.nature.clouds[4]));
	}

	private SetLands(cells: CellContext<Cell>, mode: MapMode, middleAreas: HexAxial[], items: Item[]) {
		middleAreas.forEach((corner) => {
			const cell = cells.Get(corner);
			const boundingBox = new BoundingBox();
			boundingBox.Width = GameSettings.Size * 6;
			boundingBox.Height = GameSettings.Size * 6;
			boundingBox.X = cell.GetBoundingBox().X - (boundingBox.Width / 2 - cell.GetBoundingBox().Width / 2);
			boundingBox.Y = cell.GetBoundingBox().Y - (boundingBox.Height / 2 - cell.GetBoundingBox().Height / 2);

			let floor = Archive.nature.forest;
			if (mode === MapMode.ice) {
				floor = Archive.nature.ice;
			} else if (mode === MapMode.sand) {
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
