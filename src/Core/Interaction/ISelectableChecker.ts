import { Item } from '../Items/Item';

export interface ISelectableChecker {
	IsSelectable(item: Item): boolean;
}
