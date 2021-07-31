import { Cell } from '../../../../../Items/Cell/Cell';
import { AStarEngine } from '../../../../AStarEngine';
import { Brain } from '../../../Brain';
import { BrainArea } from '../../../Utils/BrainArea';
import { GlobalRequestResult } from '../GlobalRequestResult';
import { IGlobalCondition } from '../IGlobalCondition';

export class DiamondRoadCondition implements IGlobalCondition {
	Condition(brain: Brain): GlobalRequestResult {
		if (!brain.HasDiamondRoad && brain.GetDiamond().IsAlive()) {
			const diamondAreas = this.GetDiamondAreas(brain);
			if (0 < diamondAreas.length) {
				diamondAreas.forEach((a) => {
					if (a.HasNature() || !a.HasRoadField()) {
						return new GlobalRequestResult(true, a);
					}
				});
			}
		}

		return new GlobalRequestResult(false, null);
	}

	private GetDiamondAreas(global: Brain): BrainArea[] {
		const departure = global.Hq.GetCell();
		const arrival = global.GetDiamond().GetCell();
		const engine = new AStarEngine<Cell>((c: Cell) => c !== null, (c: Cell) => 1);
		const road = engine.GetPath(departure, arrival);
		if (road === null) {
			return [];
		} else {
			const result = global.BrainAreas.filter((a) => road.some((c) => a.GetSpot().Contains(c)));
			//excule diamond & hq areas;
			return result
				.filter((r) => !(r.GetSpot().Contains(departure) && r.GetSpot().Contains(arrival)))
				.map((a) => a);
		}
	}
}
