import { ISelectableChecker } from './ISelectableChecker';
import { Item } from '../Items/Item';
import { Vehicle } from '../Items/Unit/Vehicle';

export class TrackingSelectableChecker implements ISelectableChecker {
	public IsSelectable(item: Item): boolean {
		if (item instanceof Vehicle) {
			return true;
		}
		return false;
	}
}
