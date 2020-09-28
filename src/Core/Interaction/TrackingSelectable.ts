import { ISelectableChecker } from './ISelectableChecker';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { Vehicle } from '../Items/Unit/Vehicle';

export class TrackingSelectableChecker implements ISelectableChecker {
	public IsSelectable(item: Item): boolean {
		if (item instanceof Cell) {
			return true;
		} else if (item instanceof Vehicle) {
			return true;
		}
		return false;
	}
}
