import { DateTime } from 'luxon';

export class Duration {
	constructor(public Start: number, public End: number) {}

	public GetSum(): number {
		const diff = DateTime.fromJSDate(new Date(this.End)).diff(DateTime.fromJSDate(new Date(this.Start))).toObject();
		return diff.milliseconds / 1000;
	}

	public Intersects(value: Duration) {
		return this.Start <= value.End && value.Start <= this.End;
	}

	public Includes(value: Duration) {
		return this.Start <= value.Start && value.End <= this.End;
	}
}
