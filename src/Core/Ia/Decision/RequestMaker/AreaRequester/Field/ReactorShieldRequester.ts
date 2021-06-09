import { IAreaRequestMaker } from '../../IAreaRequestMaker';
import { IaArea } from '../../../Utils/IaArea';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';
import { AreaRequestMaker } from '../../AreaRequestMaker';
import { BasicField } from '../../../../../Items/Cell/Field/BasicField';

export class ReactorShieldRequester implements IAreaRequestMaker {
	constructor(private _priority: number) {}

	GetRequest(area: IaArea): AreaRequest {
		if (area.GetInnerFoeCount() === 0 && 0 < area.GetFreeCoveredCells().length) {
			const reactor = area.GetReactor();
			if (reactor) {
				const cells = reactor.GetFilterNeighbourhood((c) => c && c.GetField() instanceof BasicField);
				if (0 < cells.length) {
					return new AreaRequest(RequestType.ReactorShield, this._priority.toString(), 1, area);
				}
			}
		}
		return AreaRequestMaker.NoRequest(area);
	}
}
