import { MiddleItemText } from './../../../../Items/Text/MiddleItemText';
import { Item } from '../../../../Items/Item';
import { BrainArea } from '../BrainArea';

export class IaNameView {
	private _aboveText: MiddleItemText;

	constructor(private _item: Item, private _iaArea: BrainArea) {
		this._aboveText = new MiddleItemText(this._item);
		const color = 0x000000;
		this._aboveText.Display(this._iaArea.GetName(), color, 0);
	}
}
