import { Floor } from '../../Items/Environment/Floor';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { Cell } from '../../Items/Cell/Cell';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { GameSettings } from '../GameSettings';
import { SvgArchive } from '../SvgArchiver';
import { MapKind } from '../Blueprint/Items/MapKind';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';

export class LandRender {
	public SetLands(cells: Dictionary<Cell>, mode: MapKind, middleAreas: HexAxial[]) {
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

			let floor = SvgArchive.nature.forest.floor;
			if (mode === MapKind.Ice) {
				floor = SvgArchive.nature.ice.floor;
			} else if (mode === MapKind.Sand) {
				floor = SvgArchive.nature.sand.floor;
			}

			const land = new Floor(boundingBox, floor);
			land.SetVisible(() => true);
			land.SetAlive(() => true);
		});
	}
}
