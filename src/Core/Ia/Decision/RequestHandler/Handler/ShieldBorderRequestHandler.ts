import { Dictionnary } from './../../../../Utils/Collections/Dictionnary';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { Cell } from '../../../../Items/Cell/Cell';
import { GameSettings } from '../../../../Framework/GameSettings';
import { BasicField } from '../../../../Items/Cell/Field/BasicField';
import { ShieldField } from '../../../../Items/Cell/Field/Bonus/ShieldField';
export class ShieldBorderRequestHandler implements ISimpleRequestHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const road = this.GetCells(request);
		this.CreateShield(road);
	}
	Type(): RequestType {
		return RequestType.BorderShield;
	}

	private GetCells(request: AreaRequest): Array<Cell> {
		const foeAreas = request.Area.GetFoesAroundArea();
		const foeCells = foeAreas.reduce((e, a) => e.concat(a.GetCells()), new Array<Cell>());
		const dic = Dictionnary.To((e) => e.Coo(), foeCells);
		const road = new Array<Cell>();
		request.Area.GetSpot().GetCells().forEach((c) => {
			if (c.GetAllNeighbourhood().some((c) => dic.Exist(c.Coo()))) {
				road.push(c);
			}
		});
		return road;
	}

	private CreateShield(road: Cell[]) {
		const price = road.length * GameSettings.FieldPrice;
		if (price < this._hq.GetAmount()) {
			console.log(`%c [SHIELD] `, 'font-weight:bold;color:blue;');
			road.forEach((c) => {
				if (c.GetField() instanceof BasicField) {
					new ShieldField(c, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
				}
			});
		}
	}
}
