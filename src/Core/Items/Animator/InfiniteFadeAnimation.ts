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
		private _end: number,
		private _step: number
	) {
		this._item.SetProperties([ this._sprite ], (e) => (e.alpha = this._start));
		this._animators = [
			new FadeInAnimation(_item, _sprite, _start, _end, _step),
			new FadeOutAnimation(_item, _sprite, _end, _start, _step)
		];
	}
	Reset(): void {}

	Update(viewX: number, viewY: number): void {
		if (this._animators[this._index].IsDone) {
			this._index = (this._index + 1) % this._animators.length;
			this._animators[this._index].Reset();
		}

		this._animators[this._index].Update(viewX, viewY);
	}
}
