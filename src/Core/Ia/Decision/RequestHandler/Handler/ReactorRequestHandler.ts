import { GameContext } from './../../../../Framework/GameContext';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { ReactorField } from '../../../../Items/Cell/Field/Bonus/ReactorField';

export class ReactorRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter, private _gameContext: GameContext) {}

	Handle(request: AreaRequest): void {
		if (GameSettings.FieldPrice < this._hq.GetAmount() && request.Area.ContainsTroop()) {
			const cells = request.Area.GetSpot().GetCells().filter((c) => c.GetField() instanceof BasicField);
			cells.some((c) => {
				if (c.GetField() instanceof BasicField) {
					const reactor = new ReactorField(c, this._hq, this._gameContext, this._hq.GetSkin().GetLight());
					this._hq.AddReactor(reactor);
					this._hq.Buy((this._hq.GetReactorsCount() + 1) * GameSettings.FieldPrice);
					console.log(`%c [REACTOR] `, 'font-weight:bold;color:blue;');
					return true;
				}
				return false;
			});
		}
	}
	Type(): RequestType {
		return RequestType.Reactor;
	}
}
