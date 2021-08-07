import { IAnimator } from './IAnimator';
import { Item } from '../Item';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';

export class RotationAnimator implements IAnimator {
	IsDone: boolean;
	private _timer: TimeTimer;

	public constructor(
		private _item: Item,
		private _sprites: string[],
		private _side: boolean,
		private _current: number = 0.05
	) {
		this._item.SetProperties(this._sprites, (e) => (e.alpha = 1));
		this._timer = new TimeTimer(20);
	}

	public Init(radian: number) {
		this._item.SetProperties(this._sprites, (s) => (s.rotation = radian));
	}

	public SetStep(step: number): void {
		this._current = step;
	}

	Reset(): void {}
	Update(): void {
		if (this._timer.IsElapsed()) {
			const delta = this._side ? this._current : -this._current;
			this._item.SetProperties(this._sprites, (s) => (s.rotation += delta));
		}
	}
}
