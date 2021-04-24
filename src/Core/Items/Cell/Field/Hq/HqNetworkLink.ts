import { ReactorField } from './../Bonus/ReactorField';
import { Cell } from './../../Cell';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Item } from '../../../Item';
import { Graphics } from 'pixi.js';
import { ZKind } from '../../../ZKind';

export class HqNetworkLink extends Item {
	private _graph: Graphics;
	private _isDestroyed: boolean = false;
	private _current: number;
	private _start: number;
	private _end: number;
	private _step: number;
	private _isFadeIn: boolean = true;

	public constructor(private _a: ReactorField, private _b: ReactorField) {
		super();
		this.Z = ZKind.Ground;
		this._start = 0.3;
		this._end = 1;
		this._step = 0.005;
		this._current = this._start;
		this._graph = new Graphics();
		this.Push(this._graph);
		this.InitPosition(this.GetBoundingBox());
		this._a.AddLink(this);
		this._b.AddLink(this);
	}

	public GetBoundingBox(): BoundingBox {
		return new BoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public GetReactors(): Array<ReactorField> {
		return [ this._a, this._b ];
	}

	public GetOpposite(r: ReactorField): ReactorField {
		if (this._a === r) {
			return this._b;
		} else if (this._b === r) {
			return this._a;
		}
		throw console.error('aouthc');
	}

	public IsConnected(cell: Cell) {
		return cell === this._a.GetCell() || cell === this._b.GetCell();
	}

	IsDestroyed(): boolean {
		return this._isDestroyed;
	}

	Destroy(): void {
		this._isDestroyed = true;
		super.Destroy();
	}

	public Update(viewX: number, viewY: number): void {
		if (this._isDestroyed) {
			return;
		}
		if (this._end < this._current) {
			this._isFadeIn = false;
			this._current = this._end;
		}

		if (this._current < this._start) {
			this._isFadeIn = true;
			this._current = this._start;
		}

		if (this._isFadeIn) {
			this._current += this._step;
		} else {
			this._current -= this._step;
		}

		this._graph.clear();
		this._graph.lineStyle(3, 0x68c7f1, this._current);
		var aPoint = this._a.GetBoundingBox().GetCentralPoint();
		var bPoint = this._b.GetBoundingBox().GetCentralPoint();
		this._graph.moveTo(aPoint.X, aPoint.Y).lineTo(bPoint.X, bPoint.Y);
	}
}