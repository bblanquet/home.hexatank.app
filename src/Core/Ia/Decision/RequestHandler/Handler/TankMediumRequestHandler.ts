import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Kingdom } from '../../Kingdom';
import { isNullOrUndefined } from 'util';
import { KingdomArea } from '../../Utils/KingdomArea';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { Tank } from '../../../../Items/Unit/Tank';
import { RequestType } from '../../Utils/RequestType';

export class TankMediumRequestHandler implements ISimpleRequestHandler {
	constructor(private _kingdom: Kingdom, private _hq: Headquarter) {}

	Type(): RequestType {
		return RequestType.Tank;
	}

	public Handle(request: AreaRequest): void {
		// console.log(`%c [M TANK] `, 'font-weight:bold;color:blue;');
		if (this._kingdom.IdleTanks.HasTank()) {
			this.GetHelpFromIdleTanks(request);
		}

		if (request.RequestCount > 0) {
			this.GetHelpFromBuying(request);
		}
	}

	private GetHelpFromIdleTanks(request: AreaRequest) {
		while (this._kingdom.IdleTanks.HasTank() && request.RequestCount > 0) {
			const cell = request.Area.GetRandomFreeCell();

			if (cell) {
				const tank = this._kingdom.IdleTanks.Pop();
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

	private GetHelpFromBuying(request: AreaRequest) {
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
}
