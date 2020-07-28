import { IAnimator } from './IAnimator';
import { Item } from '../Item';
import { FadeInAnimation } from './FadeInAnimation';
import { FadeOutAnimation } from './FadeOutAnimation';

export class FadeInOutAnimation implements IAnimator {
	public IsDone: boolean = false;
	private _animators: IAnimator[];
	private _index: number = 0;
	private _count: number = 0;

	public constructor(
		private _item: Item,
		private _sprite: string,
		private _start: number,
		end: number,
		step: number
	) {
		this._animators = [
			new FadeInAnimation(_item, _sprite, _start, end, step),
			new FadeOutAnimation(_item, _sprite, end, _start, step)
		];
		this._item.SetProperties([ this._sprite ], (e) => (e.alpha = this._start));
	}
	Reset(): void {}

	Update(viewX: number, viewY: number): void {
		if (this.IsDone) {
			return;
		}

		if (this._count === 2) {
			this.IsDone = true;
			return;
		}

		if (this._animators[this._index].IsDone) {
			this._index = (this._index + 1) % this._animators.length;
			this._animators[this._index].Reset();
			this._count += 1;
		}

		this._animators[this._index].Update(viewX, viewY);
	}
}
