import { IAnimator } from './IAnimator';
import { Item } from '../Item';

export class RotationAnimator implements IAnimator {
	IsDone: boolean;
	private _current: number = 0.03;
	private _min: number = 0.03;
	private _max: number = 0.08;
	private _step: number = 0.01;
	private _isIncreasing: boolean = false;

	public constructor(private _item: Item, private _sprites: string[], private _side: boolean) {
		this._item.SetProperties(this._sprites, (e) => (e.alpha = 1));
	}

	Reset(): void {}
	Update(viewX: number, viewY: number): void {
		if (this._isIncreasing) {
			if (this._max <= this._current) {
				this._current += this._step;
			} else {
				this._isIncreasing = false;
			}
		} else {
			if (this._current < this._min) {
				this._current -= this._step;
			} else {
				this._isIncreasing = true;
			}
		}

		const delta = this._side ? this._current : -this._current;
		this._item.SetProperties(this._sprites, (s) => (s.rotation += delta));
	}
}
