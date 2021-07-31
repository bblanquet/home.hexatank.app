import { Cell } from '../../../../../Items/Cell/Cell';
import { AStarEngine } from '../../../../AStarEngine';
import { Brain } from '../../../Brain';
import { IaArea } from '../../../Utils/IaArea';
import { IGlobalCondition } from '../IGlobalCondition';

export class DiamondRoadCondition implements IGlobalCondition {
	Condition(brain: Brain): IaArea {
		if (!brain.HasDiamondRoad && brain.GetDiamond().IsAlive()) {
			const diamondAreas = this.GetDiamondAreas(brain);
			if (0 < diamondAreas.length) {
				diamondAreas.forEach((a) => {
					if (a.HasNature() || !a.HasRoadField()) {
						return a;
					}
				});
			}
		}

		return null;
	}

	private GetDiamondAreas(global: Brain): IaArea[] {
		const departure = global.Hq.GetCell();
		const arrival = global.GetDiamond().GetCell();
		const engine = new AStarEngine<Cell>((c: Cell) => c !== null, (c: Cell) => 1);
		const road = engine.GetPath(departure, arrival);
		if (road === null) {
			return [];
		} else {
			const result = global.AreaDecisions.filter((a) => road.some((c) => a.GetSpot().Contains(c)));
			//excule diamond & hq areas;
			return result
				.filter((r) => !(r.GetSpot().Contains(departure) && r.GetSpot().Contains(arrival)))
				.map((a) => a);
		}
	}
}
