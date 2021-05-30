import { DiamondBlueprint } from './../../Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from './../../Context/DiamondContext';
import { SvgArchive } from './../../../Framework/SvgArchiver';
import { Cloud } from './../../../Items/Environment/Cloud';
import { ForestDecorator } from './../../../Items/Cell/Decorator/ForestDecorator';
import { GameSettings } from '../../../Framework/GameSettings';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { Cell } from '../../../Items/Cell/Cell';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { Item } from '../../../Items/Item';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { MapEnv } from '../../Blueprint/MapEnv';
import { Floor } from '../../../Items/Environment/Floor';
import { HqRender } from '../Hq/HqRender';
import { SimpleFloor } from '../../../Items/Environment/SimpleFloor';
import { AboveItem } from '../../../Items/AboveItem';

export class DiamondRenderer {
	public Render(blueprint: DiamondBlueprint): DiamondContext {
		const cells = new Dictionnary<Cell>();
		const updatableItem = new Array<Item>();

		blueprint.Items.forEach((item) => {
			const cell = new Cell(new CellProperties(new HexAxial(item.Position.Q, item.Position.R)), cells);
			ForestDecorator.SetDecoration(updatableItem, cell, item.Type);
			cell.SetSprite();
			cells.Add(cell.Coo(), cell);
			updatableItem.push(cell);
		});

		const areas = new AreaSearch(
			Dictionnary.To((c) => c.ToString(), cells.Values().map((c) => c.GetHexCoo()))
		).GetAreas(new HexAxial(blueprint.CenterItem.Position.Q, blueprint.CenterItem.Position.R));
		this.SetLands(cells, blueprint.MapMode, areas, updatableItem);
		this.AddClouds(updatableItem);
		const hq = new HqRender().Render(cells, blueprint.HqDiamond, updatableItem, 0);
		this.SetHqLand(cells, SvgArchive.nature.hq, [ hq.GetCell().GetHexCoo() ], updatableItem);
		this.SetHqLand(cells, SvgArchive.nature.hq2, [ hq.GetCell().GetHexCoo() ], updatableItem, 1);

		const arrivalCell = cells.Get(blueprint.HqDiamond.Diamond.Position.ToString());
		updatableItem.push(new AboveItem(arrivalCell, SvgArchive.arrow));

		return new DiamondContext(cells.Values(), hq);
	}

	public AddClouds(items: Item[]) {
		items.push(new Cloud(200, 20 * GameSettings.Size, 800, SvgArchive.nature.clouds[0]));
		items.push(new Cloud(400, 20 * GameSettings.Size, 1200, SvgArchive.nature.clouds[1]));
		items.push(new Cloud(600, 20 * GameSettings.Size, 1600, SvgArchive.nature.clouds[2]));
		items.push(new Cloud(800, 20 * GameSettings.Size, 800, SvgArchive.nature.clouds[3]));
		items.push(new Cloud(1200, 20 * GameSettings.Size, 1600, SvgArchive.nature.clouds[4]));
	}

	private SetLands(cells: Dictionnary<Cell>, mode: MapEnv, middleAreas: HexAxial[], items: Item[]) {
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
