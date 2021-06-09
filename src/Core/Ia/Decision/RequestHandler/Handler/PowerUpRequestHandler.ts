import { ReactorField } from './../../../../Items/Cell/Field/Bonus/ReactorField';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { AttackMenuItem } from '../../../../Menu/Buttons/AttackMenuItem';

export class PowerUpRequestHandler implements ISimpleRequestHandler {
	Handle(request: AreaRequest): void {
		const reactorCell = request.Area.GetSpot().GetCells().find((e) => e.GetField() instanceof ReactorField);
		if (reactorCell) {
			const reactor = reactorCell.GetField() as ReactorField;
			reactor.Overlock(new AttackMenuItem());
		}
	}

	Type(): RequestType {
		return RequestType.PowerUp;
	}
}
