import { BelowItemText } from './../../../../Items/Text/BelowItemText';
import { IaArea } from './../IaArea';
import { Item } from '../../../../Items/Item';
export class RequestIaView {
	private _belowText: BelowItemText;
	private _amount: number;

	constructor(private _item: Item, private _iaArea: IaArea) {
		this._belowText = new BelowItemText(this._item);
		this._iaArea.OnRequestAdded.On(this.TroopsChanged.bind(this));
	}

	private TroopsChanged(source: any, data: number): void {
		if (this._item.IsUpdatable) {
			this._amount = data;
			const color = 0x000000;
			this._belowText.Display(this._amount.toString(), color, 1000);
		}
	}
}
