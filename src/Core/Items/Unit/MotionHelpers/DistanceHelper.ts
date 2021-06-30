import { HexAxial } from '../../../../Utils/Geometry/HexAxial';

export class DistanceHelper {
	public static GetDistance(a: HexAxial, b: HexAxial): number {
		return a.ToCube().GetDistance(b.ToCube());
	}

	public static GetRandomElement<T>(list: Array<T>): T {
		return list[Math.floor(Math.random() * (list.length - 1)) + 0];
	}
}
