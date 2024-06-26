import { ShieldField } from './../Items/Cell/Field/Bonus/ShieldField';
import { RoadField } from './../Items/Cell/Field/Bonus/RoadField';
import { Cell } from '../Items/Cell/Cell';
export class AStarHelper {
	public static GetBasicCost(c: Cell): number {
		const cell = c as Cell;
		if (cell.GetField() instanceof RoadField) {
			return 0.5;
		} else {
			return 1;
		}
	}

	public static GetSquadCost(c: Cell): number {
		const cell = c as Cell;
		if (cell.GetField() instanceof RoadField) {
			return 0.5;
		} else if (cell.GetField() instanceof ShieldField) {
			return 3;
		} else {
			return 1;
		}
	}
}
