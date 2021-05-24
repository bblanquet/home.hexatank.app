import { BasicField } from './../../../../Items/Cell/Field/BasicField';
import { ShieldField } from './../../../../Items/Cell/Field/Bonus/ShieldField';
import { Area } from './../../Utils/Area';
import { RequestType } from './../../Utils/RequestType';
import { ISimpleRequestHandler } from '../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { IaArea } from '../../Utils/IaArea';
import { AStarEngine } from '../../../AStarEngine';
import { Cell } from '../../../../Items/Cell/Cell';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { GameSettings } from '../../../../Framework/GameSettings';
import { RoadField } from '../../../../Items/Cell/Field/Bonus/RoadField';
import { Groups } from './../../../../Utils/Collections/Groups';
import { AStarHelper } from '../../../AStarHelper';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';

export class RoadRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}
	Type(): RequestType {
		return RequestType.Road;
	}
	Handle(request: AreaRequest): void {
		const central = request.Area.GetCentralCell();
		const allyAreas = request.Area.GetAllyAreas().filter((a) => a.IsConnected());
		if (0 < allyAreas.length) {
			// has ally area  around
			const road = this.GetRoadToConnectingArea(allyAreas, central);
			const nextRoad = this.GetRoadToFarthestAreaFromHq(request.Area);

			if (0 < road.length || 0 < nextRoad.length) {
				road.push(central);
				nextRoad.forEach((r) => {
					road.push(r);
				});
				if (road.some((r) => r.GetField() instanceof BasicField)) {
					this.CreateRoad(road);
				} else {
					request.Area.SetUnconnectable();
				}
			} else {
				request.Area.SetUnconnectable();
			}
		}
	}

	private CreateRoad(road: Cell[]) {
		const price = road.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			road.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					new RoadField(c, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}

	private GetFarthestAraFromHq(area: IaArea): Area {
		const aroundAreas = area.GetSpot().GetAroundAreas().filter((a) => a.GetStatus().HasField(BasicField.name));
		if (aroundAreas.length === 0) {
			return null;
		}
		const areaByHqDistance = this.GetAllAreaByHqDistance(aroundAreas);
		const farthestHqArea = Math.max(...areaByHqDistance.Keys().map((k) => +k));
		const a = areaByHqDistance.Get(farthestHqArea.toString());
		if (0 < a.length) {
			return a[0];
		} else {
			return null;
		}
	}

	private GetRoadToFarthestAreaFromHq(area: IaArea): Cell[] {
		const destination = this.GetFarthestAraFromHq(area);
		if (destination) {
			let nextCell = destination.GetCentralCell();
			if (nextCell.IsBlocked()) {
				nextCell = destination.GetStatus().GetCells(BasicField.name)[0];
			}
			const road = this.GetRoad(area.GetCentralCell(), nextCell);
			if (road) {
				return road.filter((c) => area.GetSpot().Contains(c));
			}
		}
		return [];
	}

	private GetRoadToConnectingArea(allyAreas: IaArea[], central: Cell): Cell[] {
		const areaByHqDistance = this.GetAreaByHqDistance(allyAreas);
		const closestHqArea = Math.min(...areaByHqDistance.Keys().map((k) => +k));
		const connectingArea = areaByHqDistance.Get(closestHqArea.toString())[0];
		const connectingCell = connectingArea.GetConnectingCentralCell();
		if (isNullOrUndefined(connectingCell)) {
			return [];
		}

		const road = this.GetRoad(central, connectingCell);

		if (isNullOrUndefined(road)) {
			return [];
		} else {
			return road;
		}
	}

	private GetAreaByHqDistance(allyAreas: IaArea[]) {
		const groups = new Groups<IaArea>();
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
		const filter = (c: Cell) =>
			!isNullOrUndefined(c) &&
			(c.GetField() instanceof Headquarter || !c.HasBlockingField() || c.GetField() instanceof ShieldField);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);

		return new AStarEngine<Cell>(filter, cost).GetPath(central, target);
	}
}
