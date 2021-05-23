import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { BatteryField } from '../../../../Items/Cell/Field/Bonus/BatteryField';

export class EnergyRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		if (GameSettings.FieldPrice < this._hq.GetAmount()) {
			console.log(`%c [ENERGY] `, 'font-weight:bold;color:blue;');

			const cells = request.Area.GetSpot().GetCells().filter((c) => c.GetField() instanceof BasicField);
			cells.some((c) => {
				if (c.GetField() instanceof BasicField) {
					const bf = new BatteryField(c, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
					this._hq.AddBatteryField(bf);
					return true;
				}
				return false;
			});

			this._hq.GetReactors().forEach((r) => {
				if (r.GetPower() < 4) {
					r.PowerUp();
				}
			});
		}
	}

	Type(): RequestType {
		return RequestType.Energy;
	}
}
