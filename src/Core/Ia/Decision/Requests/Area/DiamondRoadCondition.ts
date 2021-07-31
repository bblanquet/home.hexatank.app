import { Dictionary } from '../../../../../Utils/Collections/Dictionary';
import { TypeTranslator } from '../../../../Items/Cell/Field/TypeTranslator';
import { Cell } from '../../../../Items/Cell/Cell';
import { AStarEngine } from '../../../AStarEngine';
import { Brain } from '../../Brain';
import { BrainArea } from '../../Utils/BrainArea';
import { IAreaCondition } from '../IAreaCondition';

export class DiamondRoadCondition implements IAreaCondition {
	constructor(private _brain: Brain) {}

	Condition(area: BrainArea): boolean {
		return area.HasDiamond() && area.HasTank() && area.HasFreeTank() && 0 < this.GetObstacles(this._brain).length;
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
							c && TypeTranslator.IsNatureField(c.GetField()) && !TypeTranslator.IsDiamond(c.GetField())
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
