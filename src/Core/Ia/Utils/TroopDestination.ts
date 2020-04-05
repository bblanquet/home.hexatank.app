import { Cell } from '../../Items/Cell/Cell';
import { isNullOrUndefined } from 'util';

export class TroopDestination {
	constructor(public Destination: Cell, public Path: Array<Cell>) {}

	public GetCost(): number {
		if (isNullOrUndefined(this.Path)) {
			return 1000;
		}
		return this.Path.length;
	}
}
