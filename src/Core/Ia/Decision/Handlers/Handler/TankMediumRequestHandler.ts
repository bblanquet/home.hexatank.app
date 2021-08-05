import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Brain } from '../../Brain';
import { BrainArea } from '../../Utils/BrainArea';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { Tank } from '../../../../Items/Unit/Tank';
import { ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';

export class TankMediumRequestHandler implements IHandler {
	constructor(private _brain: Brain, private _hq: Headquarter) {}

	public Handle(request: AreaRequest): void {
		if (!(this._brain.IdleTanks.HasTank() && this.GetHelpFromIdleTanks(request))) {
			this.Buy(request);
		}
	}

	private GetHelpFromIdleTanks(request: AreaRequest): boolean {
		while (this._brain.IdleTanks.HasTank()) {
			if (request.Area.HasFreeUnitCell()) {
				const tank = this._brain.IdleTanks.Pop();
				ErrorHandler.ThrowNullOrUndefined(tank);
				request.Area.Add(tank);
			} else {
				return;
			}
		}
	}

	private Buy(request: AreaRequest): boolean {
		return this.BuyTank(request.Area);
	}

	public BuyTank(area: BrainArea): boolean {
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
