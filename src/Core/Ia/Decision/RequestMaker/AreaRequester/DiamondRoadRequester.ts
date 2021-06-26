import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { TypeTranslator } from './../../../../Items/Cell/Field/TypeTranslator';
import { Cell } from '../../../../Items/Cell/Cell';
import { AStarEngine } from '../../../AStarEngine';
import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';
import { IaArea } from '../../Utils/IaArea';
import { RequestType } from '../../Utils/RequestType';
import { IAreaRequestMaker } from '../IAreaRequestMaker';

export class DiamondRoadRequester implements IAreaRequestMaker {
	constructor(private _priority: number, private _brain: Brain) {}

	GetRequest(area: IaArea): AreaRequest {
		if (
			area.HasDiamond() &&
			area.HasTroop() &&
			!area.IsTroopFighting() &&
			0 < this.GetObstacles(this._brain).length
		) {
			return new AreaRequest(RequestType.DiamondRoadCleaning, this._priority.toString(), 1, area);
		} else {
			return new AreaRequest(RequestType.None, '0', 1, area);
		}
	}

	private GetObstacles(brain: Brain): Cell[] {
		const departure = brain.Hq.GetCell();
		const arrival = brain.GetDiamond().GetCell();
		const engine = new AStarEngine<Cell>((c: Cell) => c !== null, (c: Cell) => 1);
		const road = engine.GetPath(departure, arrival);
		if (road === null) {
			return [];
		} else {
			const result = new Dictionary<Cell>();
			road.forEach((r) => {
				r
					.GetAll(1)
					.filter(
						(c) =>
							c &&
							c.IsBlocked() &&
							TypeTranslator.IsNatureField(c.GetField()) &&
							!TypeTranslator.IsDiamond(c.GetField())
					)
					.forEach((c) => {
						if (!result.Exist(c.Coo())) {
							result.Add(c.Coo(), c);
						}
					});
			});
			return result.Values();
		}
	}
}
