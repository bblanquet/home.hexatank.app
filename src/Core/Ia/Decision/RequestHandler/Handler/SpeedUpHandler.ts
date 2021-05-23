import { ReactorField } from './../../../../Items/Cell/Field/Bonus/ReactorField';
import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { SpeedFieldMenuItem } from '../../../../Menu/Buttons/SpeedFieldMenuItem';

export class SpeedUpHandler implements ISimpleRequestHandler {
	Handle(request: AreaRequest): void {
		const cell = request.Area.GetSpot().GetCells().find((e) => e.GetField() instanceof ReactorField);
		if (cell) {
			const reactor = cell.GetField() as ReactorField;
			reactor.Overlock(new SpeedFieldMenuItem());
		}
	}

	Type(): RequestType {
		return RequestType.SpeedUp;
	}
}
