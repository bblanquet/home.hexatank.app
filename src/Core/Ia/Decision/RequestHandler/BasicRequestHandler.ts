import { BasicField } from './../../../Items/Cell/Field/BasicField';
import { FastField } from './../../../Items/Cell/Field/FastField';
import { Groups } from './../../../Utils/Collections/Groups';
import { Truck } from './../../../Items/Unit/Truck';
import { Headquarter } from '../../../Items/Cell/Field/Headquarter';
import { IRequestHandler } from './IRequestHandler';
import { Kingdom } from '../Kingdom';
import { RequestPriority } from '../Utils/RequestPriority';
import { AreaRequest } from '../Utils/AreaRequest';
import { isNullOrUndefined } from 'util';
import { Cell } from '../../../Items/Cell/Cell';
import { KingdomArea } from '../Utils/KingdomArea';
import { GameSettings } from '../../../Framework/GameSettings';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Tank } from '../../../Items/Unit/Tank';
import { RequestType } from '../Utils/RequestType';
import { TruckPatrolOrder } from '../../Order/TruckPatrolOrder';
import { HqFieldOrder } from '../../Order/HqFieldOrder';
import { DiamondFieldOrder } from '../../Order/DiamondFieldOrder';
import { AStarEngine } from '../../AStarEngine';

export class BasicRequestHandler implements IRequestHandler {
	constructor(private _hq: Headquarter, private _decision: Kingdom) {}

	public HandleRequests(requests: Groups<AreaRequest>) {
		if (requests.Exist(RequestPriority.High)) {
			requests.Get(RequestPriority.High).forEach((request) => {
				if (request.RequestType === RequestType.Tank) {
					this.HandleHighTankRequest(request);
				} else if (request.RequestType === RequestType.Truck) {
					this.HandleHighTruckRequest(request);
				} else if (request.RequestType === RequestType.Road) {
					this.HandleRoadRequest(request);
				}
			});
		}
		if (requests.Exist(RequestPriority.Medium)) {
			requests.Get(RequestPriority.Medium).forEach((request) => {
				this.HandleMediumRequest(request);
			});
		}
		if (requests.Exist(RequestPriority.Low)) {
			requests.Get(RequestPriority.Low).forEach((request) => {
				this.HandleMediumRequest(request);
			});
		}
	}

	private HandleMediumRequest(request: AreaRequest) {
		if (this._decision.IdleTanks.HasTank()) {
			this.GetHelpFromIdleTanks(request);
		}

		if (request.RequestCount > 0) {
			this.GetHelpFromBuying(request);
		}
	}

	private GetHelpFromBuying(request: AreaRequest) {
		const cell = request.Area.GetCentralCell();

		while (request.RequestCount > 0) {
			const isPassed = this.BuyTank(request.Area);
			if (isPassed) {
				request.RequestCount -= 1;
			} else {
				return;
			}
		}
	}

	public BuyTank(area: KingdomArea): boolean {
		let isCreated = false;
		const cell = area.GetRandomFreeCell();
		if (!isNullOrUndefined(cell) && this._hq.Buy(GameSettings.TankPrice)) {
			var lambda: any = (obj: any, vehicle: Vehicle) => {
				if (vehicle instanceof Tank) {
					const tank = vehicle as Tank;
					area.AddTroop(tank, cell);
					isCreated = true;
				}
			};
			this._hq.OnVehiculeCreated.On(lambda);
			this._hq.CreateTank();
			this._hq.OnVehiculeCreated.Off(lambda);
		}
		return isCreated;
	}

	private GetHelpFromIdleTanks(request: AreaRequest) {
		while (this._decision.IdleTanks.HasTank() && request.RequestCount > 0) {
			const cell = request.Area.GetRandomFreeCell();

			if (cell) {
				const tank = this._decision.IdleTanks.Pop();
				if (isNullOrUndefined(tank)) {
					throw 'not possible';
				}
				request.Area.AddTroop(tank, cell);
				request.RequestCount -= 1;
			} else {
				return;
			}
		}
	}

	private HandleRoadRequest(request: AreaRequest): void {
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

	private HandleHighTruckRequest(request: AreaRequest): void {
		var lambda: any = (obj: any, vehicle: Vehicle) => {
			if (vehicle instanceof Truck) {
				const truck = vehicle as Truck;
				truck.SetOrder(
					new TruckPatrolOrder(
						truck,
						new HqFieldOrder(this._hq, truck),
						new DiamondFieldOrder(this._decision.Diamond, truck)
					)
				);
				request.Area.Truck = truck;
			}
		};
		this._hq.OnVehiculeCreated.On(lambda);
		this._hq.CreateTruck();
		this._hq.OnVehiculeCreated.Off(lambda);
	}

	private HandleHighTankRequest(request: AreaRequest): void {
		const aroundAreas = request.Area.GetSpot().GetAroundAreas();

		for (const aroundArea of aroundAreas) {
			const coordinate = aroundArea.GetCentralCell().GetCoordinate().ToString();
			if (this._decision.CellAreas.Exist(coordinate)) {
				const aroundArea = this._decision.CellAreas.Get(coordinate);
				if (!aroundArea.HasReceivedRequest) {
					aroundArea.HasReceivedRequest = true;

					while (aroundArea.Area.HasTroop()) {
						if (request.RequestCount === 0) {
							return;
						}

						const freeCell = request.Area.GetRandomFreeCell();

						if (freeCell) {
							const tank = aroundArea.Area.DropTroop();
							if (isNullOrUndefined(tank)) {
								throw 'not possible';
							}
							request.Area.AddTroop(tank, freeCell);
							request.RequestCount -= 1;
						} else {
							return;
						}
					}
				}
			}
		}

		if (request.RequestCount > 0) {
			this.HandleMediumRequest(request);
		}
	}
}
