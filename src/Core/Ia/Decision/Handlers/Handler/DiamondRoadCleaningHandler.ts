import { AStarHelper } from './../../../AStarHelper';
import { Brain } from '../../Brain';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Cell } from '../../../../Items/Cell/Cell';
import { AStarEngine } from '../../../AStarEngine';
import { TypeTranslator } from '../../../../Items/Cell/Field/TypeTranslator';
import { Dictionary } from '../../../../../Utils/Collections/Dictionary';
import { Tank } from '../../../../Items/Unit/Tank';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';

export class DiamondRoadCleaningHandler implements IHandler {
	constructor(private _brain: Brain) {}

	Handle(request: AreaRequest): void {
		const tank = request.Area.GetTroops()[0];
		if (tank) {
			const obs = this.GetObstacles(this._brain);
			if (obs.length === 1) {
				tank.GiveOrder(new TargetMonitoredOrder(obs[0], tank));
			} else if (0 < obs.length) {
				const candidates = new Array<Candidate>();
				obs.forEach((ob) => {
					var path = this.GetRoad(tank, ob);
					if (path) {
						candidates.push(new Candidate(ob, path.length));
					}
				});

				var min = Math.min(...candidates.map((c) => c.Cost));
				const candidate = candidates.find((e) => e.Cost === min);
				if (candidate) {
					tank.GiveOrder(new TargetMonitoredOrder(candidate.Cell, tank));
				}
			}
		}
	}

	private GetRoad(tank: Tank, cell: Cell): Cell[] {
		const filter = (c: Cell) => c !== null && c !== undefined;
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(filter, cost).GetPath(tank.GetCurrentCell(), cell, true);
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

export class Candidate {
	constructor(public Cell: Cell, public Cost: number) {}
}
