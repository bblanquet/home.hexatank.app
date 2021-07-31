import { FarmField } from '../../../../../Items/Cell/Field/Bonus/FarmField';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { IHandler } from '../../IHandler';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { GameSettings } from '../../../../../Framework/GameSettings';
import { Headquarter } from '../../../../../Items/Cell/Field/Hq/Headquarter';

export class FarmFieldRequestHandler implements IHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const cells = request.Area.GetFreeCoveredCells();

		const price = cells.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			cells.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					c.SetField(new FarmField(c, this._hq));
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
}
