import { TimeTimer } from '../../../../../../Utils/Timer/TimeTimer';
import { IGeneralRequester } from '../IGeneralRequester';
import { Brain } from '../../../Brain';
import { AreaRequest } from '../../../Utils/AreaRequest';
import { RequestType } from '../../../Utils/RequestType';

export class GeneralRaidRequester implements IGeneralRequester {
	private _timeTime: TimeTimer;
	constructor(private _priority: number) {
		this._timeTime = new TimeTimer(4000);
	}

	GetResquest(kingdom: Brain): AreaRequest {
		if (this._timeTime.IsElapsed()) {
			return new AreaRequest(RequestType.Tank, this._priority.toString(), 2, null);
		}
		return new AreaRequest(RequestType.None, '0', 0, null);
	}
}
