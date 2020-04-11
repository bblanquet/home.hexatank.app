import { MoneyField } from './../../../../Items/Cell/Field/MoneyField';
import { BasicField } from './../../../../Items/Cell/Field/BasicField';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { RequestPriority } from '../../Utils/RequestPriority';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Headquarter } from '../../../../Items/Cell/Field/Headquarter';

export class FarmRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const cells = request.Area.GetSpot().GetCells().filter((c) => c.GetField() instanceof BasicField);

		const price = cells.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			console.log(`%c [FARM] `, 'font-weight:bold;color:blue;');
			cells.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					new MoneyField(c);
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
	Type(): RequestType {
		return RequestType.Farm;
	}
	Priority(): RequestPriority {
		return RequestPriority.High;
	}
}
