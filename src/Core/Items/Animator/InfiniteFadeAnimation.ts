import { FadeInAnimation } from './FadeInAnimation';
import { IAnimator } from './IAnimator';
import { Item } from '../Item';
import { FadeOutAnimation } from './FadeOutAnimation';

export class InfiniteFadeAnimation implements IAnimator {
	public IsDone: boolean = false;
	private _animators: IAnimator[];
	private _index: number = 0;

	public constructor(
		private _item: Item,
		private _sprite: string,
		private _start: number,
		end: number,
		step: number
	) {
		this._item.SetProperties([ this._sprite ], (e) => (e.alpha = this._start));
		this._animators = [
			new FadeInAnimation(_item, [ this._sprite ], _start, end, step),
			new FadeOutAnimation(_item, [ this._sprite ], end, _start, step)
		];
	}
	Reset(): void {}

	Update(): void {
		if (this._animators[this._index].IsDone) {
			this._index = (this._index + 1) % this._animators.length;
			this._animators[this._index].Reset();
		}

		this._animators[this._index].Update();
	}
}
