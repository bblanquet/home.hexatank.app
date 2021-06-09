import { FarmField } from '../../../../../Items/Cell/Field/Bonus/FarmField';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { ISimpleRequestHandler } from '../../ISimpleRequestHandler';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';
import { GameSettings } from '../../../../../Framework/GameSettings';
import { Headquarter } from '../../../../../Items/Cell/Field/Hq/Headquarter';

export class FarmFieldRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const cells = request.Area.GetFreeCoveredCells();

		const price = cells.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			cells.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					new FarmField(c, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
	Type(): RequestType {
		return RequestType.Farm;
	}
}
