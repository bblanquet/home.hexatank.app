import { Dictionnary } from './../../../../Utils/Collections/Dictionnary';
import { GameContext } from './../../../../Framework/GameContext';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { ReactorField } from '../../../../Items/Cell/Field/Bonus/ReactorField';
import { Cell } from '../../../../Items/Cell/Cell';

export class ReactorRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter, private _gameContext: GameContext) {}

	Handle(request: AreaRequest): void {
		if (GameSettings.FieldPrice < this._hq.GetAmount() && request.Area.ContainsTroop()) {
			const cells = request.Area.GetSpot().GetCells().filter((c) => c.GetField() instanceof BasicField);
			if (0 < cells.length) {
				const isolatedCell = this.GetMostIsolatedCell(cells);
				const reactor = new ReactorField(
					isolatedCell,
					this._hq,
					this._gameContext,
					this._hq.GetSkin().GetLight()
				);
				this._hq.AddReactor(reactor);
				this._hq.Buy((this._hq.GetReactorsCount() + 1) * GameSettings.FieldPrice);
			}
		}
	}
	Type(): RequestType {
		return RequestType.Reactor;
	}

	private GetMostIsolatedCell(cells: Cell[]): Cell {
		const cs = new Dictionnary<Array<Cell>>();
		cells.forEach((c) => {
			const aroundCount = c.GetFilterNeighbourhood((e) => e && !e.IsBlocked()).length;
			const key = aroundCount.toString();
			if (cs.Exist(key)) {
				cs.Get(key).push(c);
			} else {
				cs.Add(key, [ c ]);
			}
		});
		const c = cs.Keys().map((e) => +e).sort();
		return cs.Get(c[0].toString())[0];
	}
}
