import { FarmField } from '../../../../../Items/Cell/Field/Bonus/FarmField';
import { IHandler } from '../../IHandler';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { GameSettings } from '../../../../../Framework/GameSettings';
import { Headquarter } from '../../../../../Items/Cell/Field/Hq/Headquarter';

export class FarmFieldRequestHandler implements IHandler {
	constructor(private _hq: Headquarter) {}

	Handle(request: AreaRequest): void {
		const freeCells = request.Area.GetFreeCoveredCells();
		if (0 < freeCells.length) {
			if (GameSettings.FieldPrice < this._hq.GetAmount()) {
				const cell = freeCells[0];
				cell.SetField(new FarmField(cell, this._hq));
			}
		}
	}
}
