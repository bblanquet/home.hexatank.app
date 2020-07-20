import { IAnimator } from './IAnimator';
import { Item } from '../Item';

export class RotationAnimator implements IAnimator {
	IsDone: boolean;
	private _current: number = 0.03;

	public constructor(private _item: Item, private _sprites: string[], private _side: boolean) {
		this._item.SetProperties(this._sprites, (e) => (e.alpha = 1));
	}

	public SetStep(step: number): void {
		this._current = step;
	}

	Reset(): void {}
	Update(viewX: number, viewY: number): void {
		const delta = this._side ? this._current : -this._current;
		this._item.SetProperties(this._sprites, (s) => (s.rotation += delta));
	}
}
