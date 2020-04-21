import { ITranslationMaker } from './ITranslationMaker';
import { IMovable } from '../../IMovable';
import { IBoundingBoxContainer } from '../../../IBoundingBoxContainer';

export class TranslationMaker<T extends IMovable & IBoundingBoxContainer> implements ITranslationMaker {
	private _item: T;
	private _yRatio: number;
	private _isInit: boolean;

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

	private GetYRatio(current: { X: number; Y: number }, target: { X: number; Y: number }): number {
		const deltaX = this.GetDelta(target.X, current.X);
		const deltaY = this.GetDelta(target.Y, current.Y);
		if (deltaX <= 0.01) {
			return 1;
		}
		return deltaY / deltaX;
	}

	public Translate(): void {
		const itemBox = this._item.GetBoundingBox();
		const nextcellBox = this._item.GetNextCell().GetBoundingBox();
		const currentCenter = itemBox.GetCenter();
		const currentMiddle = itemBox.GetMiddle();
		const nextMiddle = nextcellBox.GetMiddle();
		const nextCenter = nextcellBox.GetCenter();

		if (!this._isInit) {
			this._yRatio = this.GetYRatio(itemBox.GetCentralPoint(), nextcellBox.GetCentralPoint());
			this._isInit = true;
		}

		const ySign = nextMiddle < currentMiddle ? -1 : 1;
		const xSign = nextCenter < currentCenter ? -1 : 1;

		if (this.IsCloseEnough(currentCenter, nextCenter, this._item)) {
			itemBox.X = this._item.GetNextCell().GetBoundingBox().X;
		} else {
			itemBox.X += xSign * this._item.TranslationSpeed;
		}

		if (this.IsCloseEnough(currentMiddle, nextMiddle, this._item)) {
			itemBox.Y = this._item.GetNextCell().GetBoundingBox().Y;
		} else {
			itemBox.Y += ySign * this._item.TranslationSpeed * this._yRatio;
		}

		if (currentCenter === nextCenter && currentMiddle === nextMiddle) {
			this._item.MoveNextCell();
			this._isInit = false;
		}
	}
}
