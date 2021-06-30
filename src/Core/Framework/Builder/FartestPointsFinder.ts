import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { AStarEngine } from './../../Ia/AStarEngine';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { DistanceHelper } from '../../Items/Unit/MotionHelpers/DistanceHelper';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class FartestPointsFinder {
	private _astarEngine: AStarEngine<HexAxial>;

	public GetFartestPoints(currentPoint: HexAxial, points: Array<HexAxial>): Array<HexAxial> {
		var longest = Math.trunc(Math.max(...points.map((p) => DistanceHelper.GetDistance(currentPoint, p)))) - 1;
		return points.filter((p) => DistanceHelper.GetDistance(currentPoint, p) > longest);
	}

	public GetPoints(points: Array<HexAxial>, cells: Dictionary<HexAxial>, total: number): Array<HexAxial> {
		this._astarEngine = new AStarEngine<HexAxial>((e) => {
			return cells.Exist(e.ToString());
		}, (e) => 1);
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
			candidate.Steps = Math.min(
				...hqPoints.map((hqPoint) => {
					const path = this._astarEngine.GetPath(hqPoint, point);
					if (isNullOrUndefined(path)) {
						return -1;
					} else {
						return path.length;
					}
				})
			);
			candidates.push(candidate);
		});
		var stepMax = Math.max(...candidates.map((c) => c.Steps));
		return candidates.find((c) => c.Steps === stepMax).Point;
	}

	private GetFirstPoint(allPoints: Array<HexAxial>): HexAxial {
		let candidates = new Array<DistancePoint>();
		allPoints.forEach((point) => {
			let candidate = new DistancePoint();
			candidate.Point = point;
			candidate.Steps = Math.max(
				...allPoints.map((hqPoint) => {
					const path = this._astarEngine.GetPath(hqPoint, point);
					if (isNullOrUndefined(path)) {
						return -1;
					} else {
						return path.length;
					}
				})
			);
			candidates.push(candidate);
		});
		var stepMax = Math.max(...candidates.map((c) => c.Steps));
		return candidates.find((c) => c.Steps === stepMax).Point;
	}
}

export class DistancePoint {
	Point: HexAxial;
	Steps: number;
}
