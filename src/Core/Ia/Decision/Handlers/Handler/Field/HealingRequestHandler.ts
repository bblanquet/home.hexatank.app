import { MedicField } from '../../../../../Items/Cell/Field/Bonus/MedicField';
import { IHandler } from '../../IHandler';
import { Headquarter } from '../../../../../Items/Cell/Field/Hq/Headquarter';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { GameSettings } from '../../../../../Framework/GameSettings';

export class HealingRequestHandler implements IHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const cells = request.Area.GetSpot().GetCells().filter((c) => c.GetField() instanceof BasicField);

		const price = cells.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			cells.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					new MedicField(c, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
}
