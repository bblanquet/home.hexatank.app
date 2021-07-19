import { ShieldField } from '../../../../../Items/Cell/Field/Bonus/ShieldField';
import { ISimpleRequestHandler } from '../../ISimpleRequestHandler';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';
import { Headquarter } from '../../../../../Items/Cell/Field/Hq/Headquarter';
import { Cell } from '../../../../../Items/Cell/Cell';
import { GameSettings } from '../../../../../Framework/GameSettings';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';

export class ShieldRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		let cellCount = 2;
		if (1 < request.Area.GetRange()) {
			cellCount = 3;
		}

		this.CreateShield(request.Area.GetClosesHqField(cellCount));
	}
	Type(): RequestType {
		return RequestType.Shield;
	}

	private CreateShield(road: Cell[]) {
		const price = road.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			road.forEach((cell) => {
				if (cell.GetField() instanceof BasicField) {
					cell.SetField(new ShieldField(cell, this._hq.Identity, this._hq));
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
}
