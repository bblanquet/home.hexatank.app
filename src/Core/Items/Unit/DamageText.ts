import { AboveItemText } from '../AboveItemText';
import { AliveItem } from './../AliveItem';

export class DamageText {
	private _aboveText: AboveItemText;
	private _amount: number;

	constructor(private _aliveItem: AliveItem) {
		this._amount = this._aliveItem.GetCurrentLife();
		this._aboveText = new AboveItemText(this._aliveItem);
		this._aliveItem.OnDamageReceived.On(this.Damage.bind(this));
	}

	private Damage(source: any, data: number): void {
		if (this._aliveItem.IsUpdatable && this._aliveItem.GetCurrentCell().IsVisible()) {
			this._amount = data * -1;
			const color = this._amount < 0 ? 0xba3131 : 0x25b741;
			this._aboveText.Display(this._amount.toString(), color);
		}
	}
}
