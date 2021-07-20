import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Brain } from '../../Brain';
import { IaArea } from '../../Utils/IaArea';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { Tank } from '../../../../Items/Unit/Tank';
import { RequestType } from '../../Utils/RequestType';
import { isNullOrUndefined } from '../../../../../Utils/ToolBox';
import { ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';

export class TankMediumRequestHandler implements ISimpleRequestHandler {
	constructor(private _kingdom: Brain, private _hq: Headquarter) {}

	Type(): RequestType {
		return RequestType.Tank;
	}

	public Handle(request: AreaRequest): void {
		if (this._kingdom.IdleTanks.HasTank()) {
			this.GetHelpFromIdleTanks(request);
		}

		if (request.RequestCount > 0) {
			this.GetHelpFromBuying(request);
		}
	}

	private GetHelpFromIdleTanks(request: AreaRequest) {
		while (this._kingdom.IdleTanks.HasTank() && request.RequestCount > 0) {
			if (request.Area.HasFreeUnitCell()) {
				const tank = this._kingdom.IdleTanks.Pop();
				ErrorHandler.ThrowNull(tank);
				request.Area.Add(tank);
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

	public BuyTank(area: IaArea): boolean {
		let isCreated = false;
		if (area.HasFreeUnitCell() && this._hq.Buy(GameSettings.TankPrice * this._hq.GetTankCount())) {
			var lambda: any = (obj: any, vehicle: Vehicle) => {
				if (vehicle instanceof Tank) {
					const tank = vehicle as Tank;
					area.Add(tank);
					isCreated = true;
				}
			};
			this._hq.OnVehicleCreated.On(lambda);
			this._hq.CreateTank();
			this._hq.OnVehicleCreated.Off(lambda);
		}
		return isCreated;
	}
}
