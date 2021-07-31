import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';
import { IaArea } from '../../Utils/IaArea';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequestIterator } from '../AreaRequestIterator';
import { IGlobalRequester } from './IGlobalRequester';
import { IGlobalCondition } from './IGlobalCondition';

export class GlobalRequester implements IGlobalRequester {
	constructor(private _priority: number, private _type: RequestType, private _condition: IGlobalCondition) {}

	GetPriority(): number {
		return this._priority;
	}
	GetType(): RequestType {
		return this._type;
	}

	protected Request(area: IaArea): AreaRequest {
		return new AreaRequest(this.GetType(), this.GetPriority().toString(), area);
	}

	GetResquest(brain: Brain): AreaRequest {
		const result = this._condition.Condition(brain);
		if (result.HasRequest) {
			return this.Request(result.Area);
		} else {
			return AreaRequestIterator.NoRequest(null);
		}
	}
}
