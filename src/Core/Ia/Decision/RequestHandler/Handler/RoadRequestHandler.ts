import { RequestType } from './../../Utils/RequestType';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { KingdomArea } from '../../Utils/KingdomArea';
import { AStarEngine } from '../../../AStarEngine';
import { Cell } from '../../../../Items/Cell/Cell';
import { isNullOrUndefined } from 'util';
import { Headquarter } from '../../../../Items/Cell/Field/Headquarter';
import { GameSettings } from '../../../../Framework/GameSettings';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';
import { FastField } from '../../../../Items/Cell/Field/FastField';
import { Groups } from './../../../../Utils/Collections/Groups';
import { RequestPriority } from '../../Utils/RequestPriority';

export class RoadRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}
	Type(): RequestType {
		return RequestType.Road;
	}
	Handle(request: AreaRequest): void {
		const central = request.Area.GetCentralCell();
		const allyAreas = request.Area.GetAllyAreas().filter((a) => a.IsConnected());
		if (0 < allyAreas.length) {
			const groups = new Groups<KingdomArea>();
			allyAreas.forEach((area) => {
				groups.Add(area.GetDistanceFromHq().toString(), area);
			});

			const min = Math.min(...groups.Keys().map((k) => +k));
			const target = groups.Get(min.toString())[0];

			const road = new AStarEngine<Cell>(
				(c: Cell) =>
					(!isNullOrUndefined(c) && c.GetField() instanceof Headquarter) ||
					(!isNullOrUndefined(c) && !c.HasBlockingField())
			).GetPath(central, target.GetCentralCell());

			if (!isNullOrUndefined(road)) {
				road.push(central);
				const price = road.length * GameSettings.FieldPrice;
				if (price < this._hq.GetAmount()) {
					console.log(`%c [ROAD] `, 'font-weight:bold;color:blue;');
					road.forEach((c) => {
						if (c.GetField() instanceof BasicField) {
							new FastField(c);
							this._hq.Buy(GameSettings.FieldPrice);
						}
					});
				}
			}
		}
	}
}
