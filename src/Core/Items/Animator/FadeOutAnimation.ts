import { IAnimator } from './IAnimator';
import { Item } from '../Item';

export class FadeOutAnimation implements IAnimator {
	public IsDone: boolean = false;
	private _current: number;
	public constructor(
		private _item: Item,
		private _sprite: string,
		private _start: number,
		private _end: number,
		private _step: number
	) {
		this._item.SetProperties([ this._sprite ], (e) => (e.alpha = this._start));
		this._current = this._start;
	}
	Reset(): void {
		this._current = this._start;
		this.IsDone = false;
	}

	Update(viewX: number, viewY: number): void {
		if (this._end < this._current) {
			this._current -= this._step;
		}

		if (this._current <= this._end) {
			this._current = this._end;
			this.IsDone = true;
		}

		this._item.SetProperties([ this._sprite ], (obj) => {
			obj.alpha = this._current;
		});
	}
}
