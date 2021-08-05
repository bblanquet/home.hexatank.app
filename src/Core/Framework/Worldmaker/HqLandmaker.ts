import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { Cell } from '../../Items/Cell/Cell';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { GameSettings } from '../GameSettings';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { SimpleFloor } from '../../Items/Environment/SimpleFloor';

export class HqLandmaker {
	public SetHqLand(cells: Dictionary<Cell>, sprite: string, middleAreas: HexAxial[], z: number = 0) {
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
