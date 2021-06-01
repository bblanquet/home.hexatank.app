import { Identity } from './../Items/Identity';
import { ISelectableChecker } from './ISelectableChecker';
import { Headquarter } from '../Items/Cell/Field/Hq/Headquarter';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { Vehicle } from '../Items/Unit/Vehicle';
import { ReactorField } from '../Items/Cell/Field/Bonus/ReactorField';

export class SelectableChecker implements ISelectableChecker {
	constructor(private _playerIdentity: Identity) {}

	public IsSelectable(item: Item): boolean {
		if (!this._playerIdentity) {
			return false;
		}
		if (item instanceof Cell) {
			return true;
		} else if (item instanceof Vehicle) {
			const vehicle = <Vehicle>item;
			return vehicle.Identity.Name === this._playerIdentity.Name;
		} else if (item instanceof ReactorField) {
			const reactorField = <ReactorField>item;
			return reactorField.Hq.Identity.Name === this._playerIdentity.Name;
		} else if (item instanceof Headquarter) {
			const hq = <Headquarter>item;
			return hq.Identity.Name === this._playerIdentity.Name;
		}
		return false;
	}

	public IsSelectableWithCell(item: Item, cell: Cell): boolean {
		if (!this._playerIdentity) {
			return false;
		}
		if (item instanceof Cell) {
			return true;
		} else if (item instanceof ReactorField) {
			const reactor = <ReactorField>item;
			return reactor.Hq.Identity.Name === this._playerIdentity.Name;
		} else if (item instanceof Headquarter) {
			const hq = <Headquarter>item;
			return hq.Identity.Name === this._playerIdentity.Name;
		} else if (item instanceof Vehicle && (item as Vehicle).IsMainCell(cell)) {
			return (item as Vehicle).Identity.Name === this._playerIdentity.Name;
		}
		return false;
	}
}
