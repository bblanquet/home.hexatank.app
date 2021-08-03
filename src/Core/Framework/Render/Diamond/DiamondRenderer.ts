import { DiamondBlueprint } from './../../Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from './../../Context/DiamondContext';
import { SvgArchive } from './../../../Framework/SvgArchiver';
import { GameSettings } from '../../../Framework/GameSettings';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { Cell } from '../../../Items/Cell/Cell';
import { CellProperties } from '../../../Items/Cell/CellProperties';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { HqRender } from '../Hq/HqRender';
import { SimpleFloor } from '../../../Items/Environment/SimpleFloor';
import { AboveItem } from '../../../Items/AboveItem';
import { Decorator } from '../../../Items/Cell/Decorator/Decorator';
import { GameState } from '../../Context/GameState';
import { CloudRender } from '../CloudRender';
import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
import { LandRender } from '../LandRender';

export class DiamondRenderer {
	public Render(blueprint: DiamondBlueprint, gameState: GameState): DiamondContext {
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
		blueprint.HqDiamond.Player.Color = ColorKind.Purple;
		const hq = new HqRender().Render(cells, blueprint.HqDiamond);
		this.SetHqLand(cells, SvgArchive.nature.hq, [ hq.GetCell().GetHexCoo() ]);
		this.SetHqLand(cells, SvgArchive.nature.hq2, [ hq.GetCell().GetHexCoo() ], 1);

		const arrivalCell = cells.Get(blueprint.HqDiamond.DiamondCell.Coo.ToString());
		new AboveItem(arrivalCell, SvgArchive.arrow);

		cells.Values().forEach((cell) => {
			cell.SetPlayerHq(hq.Identity);
			cell.Listen();
		});

		return new DiamondContext(gameState, cells.Values(), hq);
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
