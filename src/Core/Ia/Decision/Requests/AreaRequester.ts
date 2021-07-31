import { AreaRequest } from '../Utils/AreaRequest';
import { BrainArea } from '../Utils/BrainArea';
import { RequestType } from '../Utils/RequestType';
import { AreaRequestIterator } from './AreaRequestIterator';
import { IAreaCondition } from './IAreaCondition';
import { IAreaRequester } from './IAreaRequester';

export class AreaRequester implements IAreaRequester {
	constructor(private _priority: number, private _type: RequestType, private _condition: IAreaCondition) {}
	GetPriority(): number {
		return this._priority;
	}
	GetType(): RequestType {
		return this._type;
	}

	protected Request(area: BrainArea): AreaRequest {
		return new AreaRequest(this.GetType(), this.GetPriority().toString(), area);
	}

	GetRequest(area: BrainArea): AreaRequest {
		if (this._condition.Condition(area)) {
			return this.Request(area);
		} else {
			return AreaRequestIterator.NoRequest(area);
		}
	}
}
