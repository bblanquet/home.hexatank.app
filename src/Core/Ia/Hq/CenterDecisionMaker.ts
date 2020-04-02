import { CellContext } from './../../Items/Cell/CellContext';
import { AreaSearch } from '../Area/AreaSearch';
import { RequestPriority } from './RequestPriority';
import { IaHeadquarter } from './IaHeadquarter';
import { AreaRequest } from '../Area/AreaRequest';
import { isNullOrUndefined } from 'util';
import { Cell } from '../../Items/Cell/Cell';
import { Area } from '../Area/Area';

export class CenterDecisionMaker {
	constructor(private _hq: IaHeadquarter, private _cells: CellContext<Cell>) {}

	public HandleRequests(requests: { [id: string]: AreaRequest[] }) {
		if (requests[RequestPriority.High].length > 0) {
			requests[RequestPriority.High].forEach((request) => {
				this.GetHelpFromSurrounding(request);
			});
		}
		if (requests[RequestPriority.Medium].length > 0) {
			requests[RequestPriority.Medium].forEach((request) => {
				this.HandleMediumRequest(request);
			});
		}
		if (requests[RequestPriority.Low].length > 0) {
			requests[RequestPriority.Low].forEach((request) => {
				this.HandleMediumRequest(request);
			});
		}
	}

	private HandleMediumRequest(request: AreaRequest) {
		if (this._hq.TankBalancer.HasTank()) {
			this.GetHelpFromExcess(request);
		}

		if (request.RequestedUnitCount > 0) {
			this.GetHelpFromBuying(request);
		}
	}

	private GetHelpFromBuying(request: AreaRequest) {
		const cell = request.Status.Area.GetCentralCell();

		while (request.RequestedUnitCount > 0) {
			const isPassed = this._hq.BuyTankForArea(request.Status.Area);
			if (isPassed) {
				console.log(
					`%c ADD MORE TROOP BUYING ${cell.GetCoordinate().ToString()}`,
					'font-weight:bold;color:green;'
				);
				request.RequestedUnitCount -= 1;
			} else {
				return;
			}
		}
	}

	private GetHelpFromExcess(request: AreaRequest) {
		const cell = request.Status.Area.GetCentralCell();

		while (this._hq.TankBalancer.HasTank() && request.RequestedUnitCount > 0) {
			const cell = request.Status.Area.GetAvailablecell();

			if (cell) {
				const tank = this._hq.TankBalancer.Pop();
				if (isNullOrUndefined(tank)) {
					throw 'not possible';
				}
				console.log(
					`%c ADD MORE TROOP EXCESS ${cell.GetCoordinate().ToString()}`,
					'font-weight:bold;color:green;'
				);
				request.Status.Area.AddTroop(tank, cell);
				request.RequestedUnitCount -= 1;
			} else {
				return;
			}
		}
	}

	private GetHelpFromSurrounding(request: AreaRequest) {
		const cell = request.Status.Area.GetCentralCell();
		const firstRange = new AreaSearch()
			.GetExcludedFirstRange(this._cells.Keys(), cell.GetCoordinate())
			.map((coo) => new Area(this._cells.Get(coo)));

		for (const area of firstRange) {
			const cellKey = area.GetCentralCell().GetCoordinate().ToString();
			if (this._hq.AreasBycell.hasOwnProperty(cellKey)) {
				const hqSurroundingArea = this._hq.AreasBycell[cellKey];
				if (!hqSurroundingArea.HasReceivedRequest) {
					hqSurroundingArea.HasReceivedRequest = true;

					while (hqSurroundingArea.HasTroop()) {
						if (request.RequestedUnitCount === 0) {
							return;
						}

						const cell = request.Status.Area.GetAvailablecell();

						if (cell) {
							const tank = hqSurroundingArea.DropTroop();
							if (isNullOrUndefined(tank)) {
								throw 'not possible';
							}
							request.Status.Area.AddTroop(tank, cell);
							console.log(
								`%c ADD MORE TROOP SUPPORT ${cell.GetCoordinate().ToString()} `,
								'font-weight:bold;color:green;'
							);
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
}
