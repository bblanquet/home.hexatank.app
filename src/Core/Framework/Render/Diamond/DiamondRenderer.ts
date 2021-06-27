import { DiamondBlueprint } from './../../Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from './../../Context/DiamondContext';
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
import { HqRender } from '../Hq/HqRender';
import { SimpleFloor } from '../../../Items/Environment/SimpleFloor';
import { AboveItem } from '../../../Items/AboveItem';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';

export class DiamondRenderer {
	public Render(blueprint: DiamondBlueprint): DiamondContext {
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
		const hq = new HqRender().Render(cells, blueprint.HqDiamond, 0);
		this.SetHqLand(cells, SvgArchive.nature.hq, [ hq.GetCell().GetHexCoo() ]);
		this.SetHqLand(cells, SvgArchive.nature.hq2, [ hq.GetCell().GetHexCoo() ], 1);

		const arrivalCell = cells.Get(blueprint.HqDiamond.Diamond.Position.ToString());
		new AboveItem(arrivalCell, SvgArchive.arrow);

		return new DiamondContext(cells.Values(), hq);
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
