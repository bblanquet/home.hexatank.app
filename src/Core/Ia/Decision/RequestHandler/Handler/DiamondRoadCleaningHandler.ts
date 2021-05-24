import { Brain } from '../../Brain';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { Cell } from '../../../../Items/Cell/Cell';
import { AStarEngine } from '../../../AStarEngine';
import { TypeTranslator } from '../../../../Items/Cell/Field/TypeTranslator';
import { Dictionnary } from '../../../../Utils/Collections/Dictionnary';

export class DiamondRoadCleaningHandler implements ISimpleRequestHandler {
	constructor(private _brain: Brain) {}

	Handle(request: AreaRequest): void {
		const obs = this.GetObstacles(this._brain);
		if (0 < obs.length) {
			const tank = request.Area.GetTroops()[0];
			tank.SetTarget(obs[0]);
		}
	}
	Type(): RequestType {
		return RequestType.DiamondRoadCleaning;
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
