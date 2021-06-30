import { DistanceHelper } from './../Unit/MotionHelpers/DistanceHelper';
import { Cell } from './Cell';
import { Groups } from './../../../Utils/Collections/Groups';

export class CellHelper {
	public static GetClosest(candidates: Cell[], source: Cell): Cell {
		const cellByDist = this.GetCellByDistance(candidates, source);
		const closestCell = Math.min(...cellByDist.Keys().map((k) => +k));
		return cellByDist.Get(closestCell.toString())[0];
	}

	public static OrderByDistance(candidates: Cell[], source: Cell): Cell[] {
		const cellByDist = this.GetCellByDistance(candidates, source);
		const keys = cellByDist.Keys().sort((n1, n2) => +n1 - +n2);
		const result = new Array<Cell>();
		keys.forEach((key) => {
			cellByDist.Get(key).forEach((e) => {
				result.push(e);
			});
		});
		return result;
	}

	private static GetCellByDistance(candidates: Cell[], source: Cell): Groups<Cell> {
		const groups = new Groups<Cell>();
		candidates.forEach((candidate) => {
			groups.Add(this.GetDistance(source, candidate).toString(), candidate);
		});
		return groups;
	}

	private static GetDistance(source: Cell, target: Cell): number {
		return DistanceHelper.GetDistance(source.GetHexCoo(), target.GetHexCoo());
	}
}
