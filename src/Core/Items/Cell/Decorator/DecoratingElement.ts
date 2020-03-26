import { DecorationType } from '../../../Setup/Generator/DecorationType';

export class DecoratingElement {
	public Count: number = 0;
	public Max: number = 0;
	constructor(public Kind: DecorationType, max: number = 0) {
		this.Max = max;
	}
	public IsUnderLimit(): boolean {
		if (this.Max <= 0) {
			return true;
		}
		return this.Count < this.Max;
	}
}
