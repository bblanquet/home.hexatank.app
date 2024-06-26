import { GameSettings } from '../../../../../Framework/GameSettings';
import { Cell } from '../../../../../Items/Cell/Cell';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { ShieldField } from '../../../../../Items/Cell/Field/Bonus/ShieldField';
import { Headquarter } from '../../../../../Items/Cell/Field/Hq/Headquarter';
import { Dictionary } from '../../../../../../Utils/Collections/Dictionary';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { IHandler } from '../../IHandler';

export class ShieldFieldBorderRequestHandler implements IHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const road = this.GetCells(request);
		this.CreateShield(road);
	}

	private GetCells(request: AreaRequest): Array<Cell> {
		const foeAreas = request.Area.GetFoesAroundArea();
		const foeCells = foeAreas.reduce((e, a) => e.concat(a.GetCells()), new Array<Cell>());
		const dic = Dictionary.To((e) => e.Coo(), foeCells);
		const road = new Array<Cell>();
		request.Area.GetSpot().GetCells().forEach((c) => {
			if (c.GetNearby().some((c) => dic.Exist(c.Coo()))) {
				road.push(c);
			}
		});
		return road;
	}

	private CreateShield(road: Cell[]) {
		const price = road.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			road.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					c.SetField(new ShieldField(c, this._hq.Identity, this._hq));
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
}
