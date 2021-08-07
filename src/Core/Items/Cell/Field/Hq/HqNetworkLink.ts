import { ReactorField } from './../Bonus/ReactorField';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { Graphics } from 'pixi.js';
import { ZKind } from '../../../ZKind';
import { CellState } from '../../CellState';

export class HqNetworkLink extends Item {
	private _graph: Graphics;
	private _isDestroyed: boolean = false;
	private _alpha: number;
	private _start: number;
	private _end: number;
	private _step: number;
	private _isFadeIn: boolean = true;
	private _isVisible: boolean = false;

	public constructor(private _leftReactorField: ReactorField, private _rightReactorField: ReactorField) {
		super();
		this.Z = ZKind.Ground;
		this._start = 0.3;
		this._end = 1;
		this._step = 0.005;
		this._alpha = this._start;
		this._graph = new Graphics();
		this.Push(this._graph);
		this.InitPosition(this.GetBoundingBox().GetPosition());
		this._leftReactorField.AddLink(this);
		this._rightReactorField.AddLink(this);
		this._leftReactorField.GetCell().OnCellStateChanged.On(this.CellStateChanged.bind(this));
		this._rightReactorField.GetCell().OnCellStateChanged.On(this.CellStateChanged.bind(this));
		this.SetVisibility();
	}

	private CellStateChanged(src: any, cellState: CellState): void {
		this.SetVisibility();
	}

	private SetVisibility() {
		if (
			this._leftReactorField.GetCell().IsVisible() &&
			!this._leftReactorField.IsLost &&
			this._rightReactorField.GetCell().IsVisible() &&
			!this._rightReactorField.IsLost
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
		return [ this._leftReactorField, this._rightReactorField ];
	}

	public GetOpposite(r: ReactorField): ReactorField {
		if (this._leftReactorField === r) {
			return this._rightReactorField;
		} else if (this._rightReactorField === r) {
			return this._leftReactorField;
		}
		throw console.error('aouthc');
	}

	public IsConnected(r: ReactorField) {
		return r === this._leftReactorField || r === this._rightReactorField;
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
			this._graph = new Graphics();
			this._graph.lineStyle(3, 0x68c7f1, this._alpha);
			const left = this._leftReactorField.GetBoundingBox().GetCentralPoint();
			const right = this._rightReactorField.GetBoundingBox().GetCentralPoint();
			this._graph.moveTo(left.X, left.Y).lineTo(right.X, right.Y);
		}
	}
}
