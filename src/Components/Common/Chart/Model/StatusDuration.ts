import { DurationState } from './DurationState';
import { Duration } from './Duration';
export class StatusDuration extends Duration {
	constructor(public Status: DurationState, public Start: number, public End: number, public Label: string) {
		super(Start, End);
	}
}
