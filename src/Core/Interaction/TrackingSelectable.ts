import { ISelectableChecker } from './ISelectableChecker';
import { Item } from '../Items/Item';
import { Vehicle } from '../Items/Unit/Vehicle';
import { Cell } from '../Items/Cell/Cell';

export class TrackingSelectableChecker implements ISelectableChecker {
	public IsSelectable(item: Item): boolean {
		if (item instanceof Vehicle) {
			return true;
		}
		return false;
	}

	IsSelectableWithCell(item: Item, cell: Cell): boolean {
		if (item instanceof Vehicle) {
			return true;
		}
		return false;
	}
}
