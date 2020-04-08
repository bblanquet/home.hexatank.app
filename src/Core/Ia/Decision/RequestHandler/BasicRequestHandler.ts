import { Truck } from './../../../Items/Unit/Truck';
import { Headquarter } from '../../../Items/Cell/Field/Headquarter';
import { IRequestHandler } from './IRequestHandler';
import { Groups } from '../../../Utils/Collections/Groups';
import { KingdomDecisionMaker } from '../KingdomDecisionMaker';
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

export class BasicRequestHandler implements IRequestHandler {
	constructor(private _hq: Headquarter, private _decision: KingdomDecisionMaker) {}

	public HandleRequests(requests: Groups<AreaRequest>) {
		if (requests.Exist(RequestPriority.High)) {
			requests.Get(RequestPriority.High).forEach((request) => {
				if (request.RequestType === RequestType.Tank) {
					this.HandleHighTankRequest(request);
				} else if (request.RequestType === RequestType.Truck) {
					this.HandleHighTruckRequest(request);
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
				this.Log(cell);
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
				this.LogExcess(cell);
				request.Area.AddTroop(tank, cell);
				request.RequestCount -= 1;
			} else {
				return;
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
							this.LogSupport(freeCell);
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

	private LogSupport(cell: Cell) {
		console.log(`%c ADD MORE TROOP SUPPORT ${cell.GetCoordinate().ToString()} `, 'font-weight:bold;color:green;');
	}

	private Log(cell: Cell) {
		console.log(`%c ADD MORE TROOP BUYING ${cell.GetCoordinate().ToString()}`, 'font-weight:bold;color:green;');
	}
	private LogExcess(cell: Cell) {
		console.log(`%c ADD MORE TROOP EXCESS ${cell.GetCoordinate().ToString()}`, 'font-weight:bold;color:green;');
	}
}
