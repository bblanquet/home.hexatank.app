import { AStarEngine } from './../../Ia/AStarEngine';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { DistanceHelper } from '../../Items/Unit/MotionHelpers/DistanceHelper';
import { isNullOrUndefined } from '../../Utils/ToolBox';

export class FartestPointsFinder {
	private _astarEngine: AStarEngine;

	constructor() {
		this._astarEngine = new AStarEngine((e) => !isNullOrUndefined(e), (e) => 1);
	}

	public GetFartestPoints(currentPoint: HexAxial, points: Array<HexAxial>): Array<HexAxial> {
		var longest = Math.trunc(Math.max(...points.map((p) => DistanceHelper.GetDistance(currentPoint, p)))) - 1;
		return points.filter((p) => DistanceHelper.GetDistance(currentPoint, p) > longest);
	}

	public GetPoints(points: Array<HexAxial>, total: number): Array<HexAxial> {
		let result = [ this.GetFirstPoint(points) ];
		while (result.length < total) {
			result.push(this.GetFarthestPoint(result, points));
		}
		return result;
	}

	private GetFarthestPoint(hqPoints: Array<HexAxial>, allPoints: Array<HexAxial>): HexAxial {
		let candidates = new Array<DistancePoint>();
		allPoints.forEach((point) => {
			let candidate = new DistancePoint();
			candidate.Point = point;
			candidate.Distance = Math.min(
				...hqPoints.map((hqPoint) => this._astarEngine.GetPath(hqPoint, point).length)
			);
			candidates.push(candidate);
		});
		var longestInClosest = Math.max(...candidates.map((c) => c.Distance));
		return candidates.find((c) => c.Distance === longestInClosest).Point;
	}

	private GetFirstPoint(allPoints: Array<HexAxial>): HexAxial {
		let candidates = new Array<DistancePoint>();
		allPoints.forEach((point) => {
			let candidate = new DistancePoint();
			candidate.Point = point;
			candidate.Distance = Math.max(
				...allPoints.map((hqPoint) => this._astarEngine.GetPath(hqPoint, point).length)
			);
			candidates.push(candidate);
		});
		var longestInClosest = Math.max(...candidates.map((c) => c.Distance));
		return candidates.find((c) => c.Distance === longestInClosest).Point;
	}
}

export class DistancePoint {
	Point: HexAxial;
	Distance: number;
}
