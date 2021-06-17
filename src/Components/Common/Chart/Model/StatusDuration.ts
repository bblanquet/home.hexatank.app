import { DurationState } from './DurationState';
import { Duration } from './Duration';
import { HexAxial } from '../../../../Core/Utils/Geometry/HexAxial';
export class StatusDuration extends Duration {
	public Coo: HexAxial;
	constructor(public Status: DurationState, public Start: number, public End: number, amount: HexAxial) {
		super(Start, End);
		this.Coo = new HexAxial(amount.Q, amount.R);
	}
}
