import { MedicField } from '../../../../../Items/Cell/Field/Bonus/MedicField';
import { IHandler } from '../../IHandler';
import { Headquarter } from '../../../../../Items/Cell/Field/Hq/Headquarter';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';
import { GameSettings } from '../../../../../Framework/GameSettings';

export class HealingRequestHandler implements IHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const freeCells = request.Area.GetFreeCoveredCells();
		if (0 < freeCells.length) {
			if (GameSettings.FieldPrice < this._hq.GetAmount()) {
				const cell = freeCells[0];
				cell.SetField(new MedicField(cell, this._hq));
			}
		}
	}
}
