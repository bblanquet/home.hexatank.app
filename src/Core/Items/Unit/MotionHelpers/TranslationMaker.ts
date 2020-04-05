import { ITranslationMaker } from './ITranslationMaker';
import { IMovable } from '../../IMovable';
import { IBoundingBoxContainer } from '../../../IBoundingBoxContainer';

export class TranslationMaker<T extends IMovable & IBoundingBoxContainer> implements ITranslationMaker {
	private _item: T;

	constructor(item: T) {
		this._item = item;
	}

	private GetDelta(a: number, b: number): number {
		if (a < b) {
			[ b, a ] = [ a, b ];
		}
		return Math.abs(b - a);
	}
	private IsCloseEnough(a: number, b: number, _item: T): boolean {
		if (a < b) {
			[ b, a ] = [ a, b ];
		}

		return Math.abs(b - a) < _item.TranslationSpeed;
	}

	private GetXRatio(current: { X: number; Y: number }, target: { X: number; Y: number }): number {
		const deltaX = this.GetDelta(target.X, current.X);
		const deltaY = this.GetDelta(target.Y, current.Y);
		if (deltaY <= 0.01) {
			return deltaX;
		}
		return deltaX / deltaY;
	}

	public Translate(): void {
		const itemBox = this._item.GetBoundingBox();
		const nextcellBox = this._item.GetNextCell().GetBoundingBox();
		const currentCenter = itemBox.GetCenter();
		const currentMiddle = itemBox.GetMiddle();
		const nextMiddle = nextcellBox.GetMiddle();
		const nextCenter = nextcellBox.GetCenter();

		const xRatio = this.GetXRatio(itemBox.GetCentralPoint(), nextcellBox.GetCentralPoint());
		const ySign = nextMiddle < currentMiddle ? -1 : 1;
		const xSign = nextCenter < currentCenter ? -1 : 1;

		if (!this.IsCloseEnough(currentCenter, nextCenter, this._item)) {
			itemBox.X += xSign * this._item.TranslationSpeed * xRatio;
		}

		if (!this.IsCloseEnough(currentMiddle, nextMiddle, this._item)) {
			itemBox.Y += ySign * this._item.TranslationSpeed;
		}

		if (
			this.IsCloseEnough(currentCenter, nextCenter, this._item) &&
			this.IsCloseEnough(currentMiddle, nextMiddle, this._item)
		) {
			this._item.MoveNextCell();
		}
	}
}
