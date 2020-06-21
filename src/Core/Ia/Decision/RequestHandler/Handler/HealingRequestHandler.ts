import { MedicField } from '../../../../Items/Cell/Field/Bonus/MedicField';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { AreaRequest } from '../../Utils/AreaRequest';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';
import { GameSettings } from '../../../../Framework/GameSettings';
import { RequestType } from '../../Utils/RequestType';

export class HealingRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const cells = request.Area.GetSpot().GetCells().filter((c) => c.GetField() instanceof BasicField);

		const price = cells.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			console.log(`%c [HEALING] `, 'font-weight:bold;color:blue;');
			cells.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					new MedicField(c, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
	Type(): RequestType {
		return RequestType.Heal;
	}
}
