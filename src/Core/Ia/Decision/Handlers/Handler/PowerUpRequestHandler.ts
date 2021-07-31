import { ReactorField } from './../../../../Items/Cell/Field/Bonus/ReactorField';
import { IHandler } from '../IHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { AttackMenuItem } from '../../../../Menu/Buttons/AttackMenuItem';

export class PowerUpRequestHandler implements IHandler {
	Handle(request: AreaRequest): void {
		const reactorCell = request.Area.GetSpot().GetCells().find((e) => e.GetField() instanceof ReactorField);
		if (reactorCell) {
			const reactor = reactorCell.GetField() as ReactorField;
			reactor.Overclock(new AttackMenuItem());
		}
	}
}
