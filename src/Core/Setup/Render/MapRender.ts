import { GameSettings } from '../../Framework/GameSettings';
import { GameHelper } from '../../Framework/GameHelper';
import { ForestDecorator } from '../../Items/Cell/Decorator/ForestDecorator';
import { CellProperties } from '../../Items/Cell/CellProperties';
import { Cloud } from '../../Items/Environment/Cloud';
import { HqRender } from './HqRender';
import { CellState } from '../../Items/Cell/CellState';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { BasicItem } from '../../Items/BasicItem';
import { Archive } from '../../Framework/ResourceArchiver';
import { MapContext } from '../Generator/MapContext';
import { MapMode } from '../Generator/MapMode';

export class MapRender {
	private _hqRender: HqRender;

	constructor() {
		this._hqRender = new HqRender();
	}

	public Render(mapContext: MapContext): void {
		GameSettings.MapSize = mapContext.Items.length;

		let playgroundItems = new Array<Item>();

		mapContext.Items.forEach((item) => {
			let cell = new Cell(new CellProperties(item.Position));
			ForestDecorator.SetDecoration(playgroundItems, cell, item.Type);
			cell.SetSprite();
			GameHelper.Cells.Add(cell);
			playgroundItems.push(cell);
			GameHelper.Cells.Add(cell);
		});

		let areas = GameHelper.GetAreas(GameHelper.Cells.Get(mapContext.CenterItem.Position));
		this.SetGrass(mapContext.MapMode, areas.map((a) => a.GetCentralCell().GetCoordinate()), playgroundItems);
		this.AddClouds(playgroundItems);
		const hqs = this._hqRender.GetHq(mapContext.Hqs, playgroundItems);

		let playerHq = hqs.find((hq) => hq.PlayerName === GameHelper.PlayerName);
		GameHelper.PlayerHeadquarter = playerHq;

		//make hq cells visible
		playerHq.GetCurrentCell().SetState(CellState.Visible);
		playerHq.GetCurrentCell().GetAllNeighbourhood().forEach((cell) => {
			(<Cell>cell).SetState(CellState.Visible);
		});

		//insert elements into playground
		playgroundItems.forEach((item) => {
			GameHelper.Playground.Items.push(item);
		});
	}

	public AddClouds(items: Item[]) {
		items.push(new Cloud(200, 20 * GameSettings.Size, 800, Archive.nature.clouds[0]));
		items.push(new Cloud(400, 20 * GameSettings.Size, 1200, Archive.nature.clouds[1]));
		items.push(new Cloud(600, 20 * GameSettings.Size, 1600, Archive.nature.clouds[2]));
		items.push(new Cloud(800, 20 * GameSettings.Size, 800, Archive.nature.clouds[3]));
		items.push(new Cloud(1200, 20 * GameSettings.Size, 1600, Archive.nature.clouds[4]));
	}

	private SetGrass(mode: MapMode, middleAreas: HexAxial[], items: Item[]) {
		middleAreas.forEach((corner) => {
			const cell = GameHelper.Cells.Get(corner);
			const boundingBox = new BoundingBox();
			boundingBox.Width = GameSettings.Size * 6;
			boundingBox.Height = GameSettings.Size * 6;
			boundingBox.X = cell.GetBoundingBox().X - (boundingBox.Width / 2 - cell.GetBoundingBox().Width / 2);
			boundingBox.Y = cell.GetBoundingBox().Y - (boundingBox.Height / 2 - cell.GetBoundingBox().Height / 2);
			const grass = new BasicItem(
				boundingBox,
				mode === MapMode.forest ? Archive.nature.grass : Archive.nature.sand
			);
			grass.SetVisible(() => true);
			grass.SetAlive(() => true);
			items.push(grass);
		});
	}
}
