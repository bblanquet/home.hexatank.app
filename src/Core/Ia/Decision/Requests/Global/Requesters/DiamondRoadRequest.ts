import { Cell } from './../../../../../Items/Cell/Cell';
import { AStarEngine } from './../../../../AStarEngine';
import { IGeneralRequester } from './../IGeneralRequester';
import { Brain } from '../../../Brain';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { IaArea } from '../../../Utils/IaArea';
import { RequestType } from '../../../Utils/RequestType';

export class DiamondRoadRequest implements IGeneralRequester {
	constructor(private _priority: number) {}

	GetResquest(global: Brain): AreaRequest {
		if (!global.HasDiamondRoad && global.GetDiamond().IsAlive()) {
			const diamondAreas = this.GetDiamondAreas(global);
			if (0 < diamondAreas.length) {
				diamondAreas.forEach((a) => {
					if (a.HasNature()) {
						return new AreaRequest(RequestType.Clear, this._priority.toString(), 0, a);
					} else if (!a.HasRoadField()) {
						return new AreaRequest(RequestType.DiamondRoad, this._priority.toString(), 0, a);
					}
				});
			}
		}

		return new AreaRequest(RequestType.DiamondRoad, '0', 0, null);
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
