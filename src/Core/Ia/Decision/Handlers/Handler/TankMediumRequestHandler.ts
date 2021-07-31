import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { Brain } from '../../Brain';
import { IaArea } from '../../Utils/IaArea';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { Tank } from '../../../../Items/Unit/Tank';
import { ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';

export class TankMediumRequestHandler implements IHandler {
	private _delta: number = 0;
	constructor(private _brain: Brain, private _hq: Headquarter) {}

	public Handle(request: AreaRequest): void {
		this._delta = request.Area.Tanks.length - request.Area.GetFoesCount();
		if (this._brain.IdleTanks.HasTank()) {
			this.GetHelpFromIdleTanks(request);
		}

		if (this._delta > 0) {
			this.GetHelpFromBuying(request);
		}
	}

	private GetHelpFromIdleTanks(request: AreaRequest) {
		while (this._brain.IdleTanks.HasTank() && this._delta > 0) {
			if (request.Area.HasFreeUnitCell()) {
				const tank = this._brain.IdleTanks.Pop();
				ErrorHandler.ThrowNull(tank);
				request.Area.Add(tank);
				this._delta -= 1;
			} else {
				return;
			}
		}
	}

	private GetHelpFromBuying(request: AreaRequest) {
		while (this._delta > 0) {
			const isPassed = this.BuyTank(request.Area);
			if (isPassed) {
				this._delta -= 1;
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
