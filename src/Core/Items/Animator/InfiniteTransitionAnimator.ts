import { IAnimator } from './IAnimator';
import { Item } from '../Item';
import { TransitionAnimation } from './TransitionAnimator';

export class InfiniteTransitionAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _animators: IAnimator[];
	private _index: number = 0;

	public constructor(item: Item, private _isX: boolean, private _distance: number, private _step: number) {
		this._animators = [
			new TransitionAnimation(item, this._isX, this._distance, this._step),
			new TransitionAnimation(item, this._isX, -this._distance, this._step)
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
