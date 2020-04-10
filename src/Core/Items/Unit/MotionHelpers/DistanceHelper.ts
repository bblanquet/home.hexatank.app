import { HexAxial } from '../../../Utils/Geometry/HexAxial';

export class DistanceHelper {
	public static GetDistance(point: HexAxial, compareToPoint: HexAxial): number {
		return Math.abs(Math.sqrt(Math.pow(point.Q - compareToPoint.Q, 2) + Math.pow(point.R - compareToPoint.R, 2)));
	}

	public static GetRandomElement<T>(list: Array<T>): T {
		return list[Math.floor(Math.random() * (list.length - 1)) + 0];
	}
}
