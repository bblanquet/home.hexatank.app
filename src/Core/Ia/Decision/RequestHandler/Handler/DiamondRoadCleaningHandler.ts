import { AStarHelper } from './../../../AStarHelper';
import { Brain } from '../../Brain';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { Cell } from '../../../../Items/Cell/Cell';
import { AStarEngine } from '../../../AStarEngine';
import { TypeTranslator } from '../../../../Items/Cell/Field/TypeTranslator';
import { Dictionnary } from '../../../../Utils/Collections/Dictionnary';
import { Tank } from '../../../../Items/Unit/Tank';

export class DiamondRoadCleaningHandler implements ISimpleRequestHandler {
	constructor(private _brain: Brain) {}

	Handle(request: AreaRequest): void {
		const obs = this.GetObstacles(this._brain);
		const troop = request.Area.GetTroops()[0];
		if (obs.length === 1) {
			troop.SetTarget(obs[0]);
		} else if (0 < obs.length) {
			const candidates = new Array<Candidate>();
			obs.forEach((ob) => {
				var path = this.GetRoad(troop.Tank, ob);
				if (path) {
					candidates.push(new Candidate(ob, path.length));
				}
			});

			var min = Math.min(...candidates.map((c) => c.Cost));
			const candidate = candidates.find((e) => e.Cost === min);
			if (candidate) {
				troop.SetTarget(candidate.Cell);
			}
		}
	}
	Type(): RequestType {
		return RequestType.DiamondRoadCleaning;
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
			const result = new Dictionnary<Cell>();
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

export class Candidate {
	constructor(public Cell: Cell, public Cost: number) {}
}
