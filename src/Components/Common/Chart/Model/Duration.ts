export class Duration {
	constructor(public Start: number, public End: number) {}

	public GetSum(): number {
		return this.End - this.Start;
	}

	public Intersects(value: Duration) {
		return (value.Start < this.Start && this.Start < value.End) || (value.Start < this.End && this.End < value.End);
	}

	public Includes(value: Duration) {
		return this.Start <= value.Start && value.End <= this.End;
	}
}
