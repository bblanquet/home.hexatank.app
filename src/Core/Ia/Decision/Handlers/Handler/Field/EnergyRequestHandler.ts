import { IHandler } from '../../IHandler';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { GameSettings } from '../../../../../Framework/GameSettings';
import { Headquarter } from '../../../../../Items/Cell/Field/Hq/Headquarter';
import { BatteryField } from '../../../../../Items/Cell/Field/Bonus/BatteryField';

export class EnergyRequestHandler implements IHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		if (GameSettings.FieldPrice < this._hq.GetAmount()) {
			const cells = request.Area.GetFreeCoveredCells();
			cells.some((c) => {
				if (c.GetField() instanceof BasicField) {
					const bf = c.SetField(new BatteryField(c, this._hq));
					this._hq.Buy(GameSettings.FieldPrice);
					this._hq.AddBatteryField(bf);
					return true;
				}
				return false;
			});

			this._hq.GetReactors().forEach((r) => {
				if (r.GetPower() < 4) {
					r.EnergyUp();
				}
			});
		}
	}
}
