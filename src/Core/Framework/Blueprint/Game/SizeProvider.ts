import { MapShape } from '../Items/MapShape';
import { MapSize } from '../Items/MapSize';

export class SizeProvider {
	public GetSize(hqCount: number, mapType: MapShape): MapSize {
		if (hqCount == 2) {
			if (mapType === MapShape.Y || mapType === MapShape.Triangle) {
				return MapSize.Medium;
			}
			return MapSize.Small;
		} else {
			return MapSize.Medium;
		}
	}
}
