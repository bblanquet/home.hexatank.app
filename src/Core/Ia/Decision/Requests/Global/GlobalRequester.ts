import { Brain } from '../../Brain';
import { AreaRequest } from '../../Utils/AreaRequest';
import { IaArea } from '../../Utils/IaArea';
import { RequestType } from '../../Utils/RequestType';
import { AreaRequestIterator } from '../AreaRequestIterator';
import { IGlobalRequester } from './IGlobalRequester';

export class GlobalRequester implements IGlobalRequester {
	constructor(private _priority: number, private _type: RequestType, private _condition: (area: Brain) => IaArea) {}

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
		const area = this._condition(brain);
		if (area) {
			return this.Request(area);
		} else {
			return AreaRequestIterator.NoRequest(null);
		}
	}
}
