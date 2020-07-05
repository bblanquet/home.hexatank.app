import { HexAxial } from './../../../../Utils/Geometry/HexAxial';
import { KingdomArea } from './../../Utils/KingdomArea';
import { ShieldField } from './../../../../Items/Cell/Field/Bonus/ShieldField';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { Cell } from '../../../../Items/Cell/Cell';
import { GameSettings } from '../../../../Framework/GameSettings';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';
import { DistanceHelper } from '../../../../Items/Unit/MotionHelpers/DistanceHelper';

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
			console.log(`%c [ROAD] `, 'font-weight:bold;color:blue;');
			road.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					new ShieldField(c, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
}
