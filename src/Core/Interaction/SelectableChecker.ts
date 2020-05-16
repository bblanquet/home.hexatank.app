import { ISelectableChecker } from './ISelectableChecker';
import { Headquarter } from '../Items/Cell/Field/Hq/Headquarter';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { Vehicle } from '../Items/Unit/Vehicle';
import { InfluenceField } from '../Items/Cell/Field/Bonus/InfluenceField';

export class SelectableChecker implements ISelectableChecker {
	constructor(private _currentHq: Headquarter) {}

	public IsSelectable(item: Item): boolean {
		if (item instanceof Cell) {
			return true;
		} else if (item instanceof Vehicle) {
			const vehicle = <Vehicle>item;
			return !vehicle.IsEnemy(this._currentHq);
		} else if (item instanceof InfluenceField) {
			const influenceField = <InfluenceField>item;
			return influenceField.Hq === this._currentHq;
		} else if (item instanceof Headquarter) {
			const hq = <Headquarter>item;
			return hq === this._currentHq;
		}
		return false;
	}
}
