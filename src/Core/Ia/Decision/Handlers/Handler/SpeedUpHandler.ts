import { ReactorField } from './../../../../Items/Cell/Field/Bonus/ReactorField';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { SpeedFieldMenuItem } from '../../../../Menu/Buttons/SpeedFieldMenuItem';

export class SpeedUpHandler implements IHandler {
	Handle(request: AreaRequest): void {
		const cell = request.Area.GetSpot().GetCells().find((e) => e.GetField() instanceof ReactorField);
		if (cell) {
			const reactor = cell.GetField() as ReactorField;
			reactor.Overclock(new SpeedFieldMenuItem());
		}
	}
}
