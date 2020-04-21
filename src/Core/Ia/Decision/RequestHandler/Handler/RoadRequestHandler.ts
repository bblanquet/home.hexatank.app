import { Area } from './../../Utils/Area';
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

export class RoadRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}
	Type(): RequestType {
		return RequestType.Road;
	}
	Handle(request: AreaRequest): void {
		const central = request.Area.GetCentralCell();
		const allyAreas = request.Area.GetAllyAreas().filter((a) => a.IsConnected());
		if (0 < allyAreas.length) {
			const road = this.GetRoadToConnectingArea(allyAreas, central);
			const nextRoad = this.GetRoadFarthest(request.Area);

			if (0 < road.length && 0 < nextRoad.length) {
				road.push(central);
				nextRoad.forEach((r) => {
					road.push(r);
				});
				this.CreateRoad(road);
			}
		}
	}

	private CreateRoad(road: Cell[]) {
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

	private GetFarthestFromHq(area: KingdomArea): Area {
		const aroundAreas = area.GetSpot().GetAroundAreas().filter((a) => a.HasFreeCells());
		const areaByHqDistance = this.GetAllAreaByHqDistance(aroundAreas);
		const farthestHqArea = Math.max(...areaByHqDistance.Keys().map((k) => +k));
		const a = areaByHqDistance.Get(farthestHqArea.toString());
		if (0 < a.length) {
			return a[0];
		} else {
			return null;
		}
	}

	private GetRoadFarthest(area: KingdomArea): Cell[] {
		const destination = this.GetFarthestFromHq(area);
		if (destination) {
			let nextCell = destination.GetCentralCell();
			if (nextCell.IsBlocked()) {
				nextCell = destination.GetFreeCells()[0];
			}
			const road = this.GetRoad(area.GetCentralCell(), nextCell);
			if (road) {
				return road.filter((c) => area.GetSpot().Contains(c));
			}
		}
		return [];
	}

	private GetRoadToConnectingArea(allyAreas: KingdomArea[], central: Cell): Cell[] {
		const areaByHqDistance = this.GetAreaByHqDistance(allyAreas);
		const closestHqArea = Math.min(...areaByHqDistance.Keys().map((k) => +k));
		const connectingArea = areaByHqDistance.Get(closestHqArea.toString())[0];
		const road = this.GetRoad(central, connectingArea.GetConnectingCentralCell());

		if (isNullOrUndefined(road)) {
			return [];
		} else {
			return road;
		}
	}

	private GetAreaByHqDistance(allyAreas: KingdomArea[]) {
		const groups = new Groups<KingdomArea>();
		allyAreas.forEach((area) => {
			groups.Add(area.GetDistanceFromHq().toString(), area);
		});
		return groups;
	}

	private GetAllAreaByHqDistance(aroundAreas: Area[]) {
		const groups = new Groups<Area>();
		aroundAreas.forEach((area) => {
			groups.Add(area.GetDistanceFrom(this._hq.GetCell()).toString(), area);
		});
		return groups;
	}

	private GetRoad(central: Cell, target: Cell) {
		return new AStarEngine<Cell>(
			(c: Cell) => !isNullOrUndefined(c) && (c.GetField() instanceof Headquarter || !c.HasBlockingField())
		).GetPath(central, target);
	}
}
