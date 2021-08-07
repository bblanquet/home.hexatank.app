import { ReactorField } from './../Bonus/ReactorField';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { Graphics } from 'pixi.js';
import { ZKind } from '../../../ZKind';
import { CellState } from '../../CellState';
import { ErrorCat, ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';

export class HqNetworkLink extends Item {
	private _graph: Graphics;
	private _isDestroyed: boolean = false;
	private _alpha: number;
	private _start: number;
	private _end: number;
	private _step: number;
	private _isFadeIn: boolean = true;
	private _isVisible: boolean = false;

	public constructor(private _left: ReactorField, private _right: ReactorField) {
		super();
		this.Z = ZKind.Ground;
		this._start = 0.3;
		this._end = 1;
		this._step = 0.005;
		this._alpha = this._start;
		this._graph = new Graphics();
		this.Push(this._graph);
		this.InitPosition(this.GetBoundingBox().GetPosition());
		this._left.AddLink(this);
		this._right.AddLink(this);
		this._left.GetCell().OnCellStateChanged.On(this.CellStateChanged.bind(this));
		this._right.GetCell().OnCellStateChanged.On(this.CellStateChanged.bind(this));
		this.SetVisibility();
	}

	private CellStateChanged(src: any, cellState: CellState): void {
		this.SetVisibility();
	}

	private SetVisibility() {
		if (
			this._left.GetCell().IsVisible() &&
			!this._left.IsLost &&
			this._right.GetCell().IsVisible() &&
			!this._right.IsLost
		) {
			this._isVisible = true;
		} else {
			this._isVisible = false;
			if (this._graph && this._graph.geometry) {
				this._graph.clear();
			}
		}
	}

	public GetBoundingBox(): BoundingBox {
		return new BoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public GetReactors(): Array<ReactorField> {
		return [ this._left, this._right ];
	}

	public GetOpposite(r: ReactorField): ReactorField {
		if (this._left === r) {
			return this._right;
		} else if (this._right === r) {
			return this._left;
		}
		ErrorHandler.Throw(ErrorCat.outOfRange, 'wrong reactor');
	}

	public IsConnected(r: ReactorField) {
		return r === this._left || r === this._right;
	}

	IsDestroyed(): boolean {
		return this._isDestroyed;
	}

	Destroy(): void {
		this._isDestroyed = true;
		super.Destroy();
	}

	public Update(): void {
		if (this._isDestroyed) {
			return;
		}
		if (this._isVisible) {
			if (this._end < this._alpha) {
				this._isFadeIn = false;
				this._alpha = this._end;
			}

			if (this._alpha < this._start) {
				this._isFadeIn = true;
				this._alpha = this._start;
			}

			if (this._isFadeIn) {
				this._alpha += this._step;
			} else {
				this._alpha -= this._step;
			}

			this._graph.clear();
			this._graph.lineStyle(3, 0x68c7f1, this._alpha);
			const left = this._left.GetBoundingBox().GetCentralPoint();
			const right = this._right.GetBoundingBox().GetCentralPoint();
			this._graph.moveTo(left.X, left.Y).lineTo(left.X, left.Y).lineTo(right.X, right.Y);
		}
	}
}
