import { AboveItemText } from '../../../../Items/Text/AboveItemText';
import { Item } from '../../../../Items/Item';
import { BrainArea } from '../BrainArea';

export class TroopIaView {
	private _aboveText: AboveItemText;
	private _amount: number;

	constructor(private _item: Item, private _iaArea: BrainArea) {
		this._aboveText = new AboveItemText(this._item);
		this._iaArea.OnTankChanged.On(this.TroopsChanged.bind(this));
	}

	private TroopsChanged(source: any, data: number): void {
		if (this._item.IsUpdatable) {
			this._amount = data;
			const color = 0x000000;
			this._aboveText.Display(this._amount.toString(), color, 0);
		}
	}
}
