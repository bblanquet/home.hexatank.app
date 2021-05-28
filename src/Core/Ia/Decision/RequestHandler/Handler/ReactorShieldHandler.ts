import { BasicField } from './../../../../Items/Cell/Field/BasicField';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { ShieldField } from '../../../../Items/Cell/Field/Bonus/ShieldField';

export class ReactorShieldHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const reactor = request.Area.GetReactor();
		if (reactor) {
			const cells = reactor.GetFilterNeighbourhood((c) => c && c.GetField() instanceof BasicField);
			const price = cells.length * GameSettings.FieldPrice;
			if (price <= this._hq.GetAmount()) {
				cells.forEach((c) => {
					new ShieldField(c, this._hq.Identity, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
				});
			}
		}
	}

	Type(): RequestType {
		return RequestType.ReactorShield;
	}
}
