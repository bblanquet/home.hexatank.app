import { BelowItemText } from './../../../../Items/Text/BelowItemText';
import { IaArea } from './../IaArea';
import { Item } from '../../../../Items/Item';
export class RequestIaView {
	private _aboveText: BelowItemText;
	private _amount: number;

	constructor(private _item: Item, private _iaArea: IaArea) {
		this._aboveText = new BelowItemText(this._item);
		this._iaArea.OnRequestAdded.On(this.TroopsChanged.bind(this));
	}

	private TroopsChanged(source: any, data: number): void {
		if (this._item.IsUpdatable) {
			this._amount = data;
			const color = 0x000000;
			this._aboveText.Display(this._amount.toString(), color, 1000);
		}
	}
}
