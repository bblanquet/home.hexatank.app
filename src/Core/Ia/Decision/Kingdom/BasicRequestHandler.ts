import { Groups } from '../../../Utils/Collections/Groups';
import { BasicKingdomDecisionMaker } from './BasicKingdomDecisionMaker';
import { CellContext } from '../../../Items/Cell/CellContext';
import { AreaSearch } from '../../Utils/AreaSearch';
import { RequestPriority } from '../../Hq/RequestPriority';
import { AreaRequest } from '../../Utils/AreaRequest';
import { isNullOrUndefined } from 'util';
import { Cell } from '../../../Items/Cell/Cell';
import { Area } from '../../Utils/Area';

export class BasicRequestHandler {
	constructor(private _intel: BasicKingdomDecisionMaker, private _cells: CellContext<Cell>) {}

	public HandleRequests(requests: Groups<AreaRequest>) {
		if (requests.Exist(RequestPriority.High)) {
			requests.Get(RequestPriority.High).forEach((request) => {
				this.HandleSupport(request);
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
		if (this._intel.IdleTanks.HasTank()) {
			this.GetHelpFromExcess(request);
		}

		if (request.RequestedUnitCount > 0) {
			this.GetHelpFromBuying(request);
		}
	}

	private GetHelpFromBuying(request: AreaRequest) {
		const cell = request.Status.Area.GetCentralCell();

		while (request.RequestedUnitCount > 0) {
			const isPassed = this._intel.BuyTankForArea(request.Status.Area);
			if (isPassed) {
				this.Log(cell);
				request.RequestedUnitCount -= 1;
			} else {
				return;
			}
		}
	}

	private GetHelpFromExcess(request: AreaRequest) {
		const cell = request.Status.Area.GetCentralCell();

		while (this._intel.IdleTanks.HasTank() && request.RequestedUnitCount > 0) {
			const cell = request.Status.Area.GetRandomFreeCell();

			if (cell) {
				const tank = this._intel.IdleTanks.Pop();
				if (isNullOrUndefined(tank)) {
					throw 'not possible';
				}
				this.LogExcess(cell);
				request.Status.Area.AddTroop(tank, cell);
				request.RequestedUnitCount -= 1;
			} else {
				return;
			}
		}
	}

	private HandleSupport(request: AreaRequest): void {
		const cell = request.Status.Area.GetCentralCell();
		const firstRange = new AreaSearch()
			.GetExcludedFirstRange(this._cells.Keys(), cell.GetCoordinate())
			.map((coo) => new Area(this._cells.Get(coo)));

		for (const area of firstRange) {
			const coordinate = area.GetCentralCell().GetCoordinate().ToString();
			if (this._intel.CellAreas.Exist(coordinate)) {
				const aroundArea = this._intel.CellAreas.Get(coordinate);
				if (!aroundArea.HasReceivedRequest) {
					aroundArea.HasReceivedRequest = true;

					while (aroundArea.HasTroop()) {
						if (request.RequestedUnitCount === 0) {
							return;
						}

						const freeCell = request.Status.Area.GetRandomFreeCell();

						if (freeCell) {
							const tank = aroundArea.DropTroop();
							if (isNullOrUndefined(tank)) {
								throw 'not possible';
							}
							request.Status.Area.AddTroop(tank, freeCell);
							this.LogSupport(freeCell);
							request.RequestedUnitCount -= 1;
						} else {
							return;
						}
					}
				}
			}
		}

		if (request.RequestedUnitCount > 0) {
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
