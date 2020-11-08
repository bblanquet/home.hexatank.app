import { Cell } from '../Items/Cell/Cell';
import { Item } from '../Items/Item';

export interface ISelectableChecker {
	IsSelectable(item: Item): boolean;
	IsSelectableWithCell(item: Item, cell: Cell): boolean;
}
