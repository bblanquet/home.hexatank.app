import { CellType } from '../../../Framework/Blueprint/Items/CellType';

export class DecoratingElement {
	public Count: number = 0;
	public Max: number = 0;
	constructor(public Type: CellType, max: number = 0) {
		this.Max = max;
	}
	public IsUnderLimit(): boolean {
		if (this.Max <= 0) {
			return true;
		}
		return this.Count < this.Max;
	}
}
