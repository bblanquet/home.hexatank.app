import { Duration } from './Duration';
import { RecordAction } from '../../../../Core/Framework/Record/RecordAction';

export class ActionDuration extends Duration {
	constructor(public Action: RecordAction, public Start: number, public End: number) {
		super(Start, End);
	}
}
