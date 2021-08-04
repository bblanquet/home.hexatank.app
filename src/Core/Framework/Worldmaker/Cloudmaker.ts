import { Cloud } from '../../Items/Environment/Cloud';
import { Point } from '../../../Utils/Geometry/Point';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { Cell } from '../../Items/Cell/Cell';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { GameSettings } from '../GameSettings';
import { SvgArchive } from '../SvgArchiver';

export class Cloudmaker {
	public SetClouds(cells: Dictionary<Cell>, area: HexAxial[]): void {
		for (let index = 0; index < 5; index++) {
			const pos = cells.Get(area[Math.round(Math.random() * (area.length - 1))].ToString());
			const cldIndex = Math.round(Math.random() * 4);
			new Cloud(
				new Point(pos.GetCentralPoint().X, pos.GetCentralPoint().Y),
				20 * GameSettings.Size,
				SvgArchive.nature.clouds[cldIndex]
			);
		}
	}
}
