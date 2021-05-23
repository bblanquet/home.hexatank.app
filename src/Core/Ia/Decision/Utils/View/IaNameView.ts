import { MiddleItemText } from './../../../../Items/Text/MiddleItemText';
import { Item } from '../../../../Items/Item';
import { IaArea } from './../IaArea';

export class IaNameView {
	private _aboveText: MiddleItemText;

	constructor(private _item: Item, private _iaArea: IaArea) {
		this._aboveText = new MiddleItemText(this._item);
		const color = 0x000000;
		this._aboveText.Display(this._iaArea.GetName(), color, 0);
	}
}
