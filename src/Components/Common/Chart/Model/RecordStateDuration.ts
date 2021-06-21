import { IRecordState } from '../../../../Core/Framework/Record/Model/Item/State/IRecordState';
import { Duration } from './Duration';

export class RecordStateDuration<T extends IRecordState> extends Duration {
	constructor(public State: T, public Start: number, public End: number) {
		super(Start, End);
	}
}
