import { BoundingBox } from './../../Utils/Geometry/BoundingBox';
import { TimeTimer } from './../../Utils/Timer/TimeTimer';
import { BasicItem } from './../BasicItem';
import { IAnimator } from './IAnimator';
import { Cell } from './../Cell/Cell';
import { Archive } from '../../Framework/ResourceArchiver';
import { BouncingScaleUpAnimator } from './BouncingScaleUpAnimator';
export class RangeAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _range: number = 0;
	private _timer: TimeTimer;
	private _items: BasicItem[];
	private _animators: IAnimator[];

	constructor(private _origin: Cell, private _totalRange: number) {
		this._timer = new TimeTimer(500);
		this._items = [];
		this._animators = [];
	}

	Reset(): void {
		this._range = 0;
		this._items.forEach((i) => {
			i.Destroy();
		});
		this._items = [];
		this._animators = [];
		this.IsDone = false;
	}
	Update(viewX: number, viewY: number): void {
		if (this.IsDone) {
			return;
		}

		if (this._range === this._totalRange && this._animators.every((a) => a.IsDone)) {
			this.Reset();
			this.IsDone = true;
			return;
		}

		if (this._range < this._totalRange && this._timer.IsElapsed()) {
			let newCells = new Array<Cell>();
			if (this._range === 0) {
				newCells.push(this._origin);
			} else {
				newCells = this._origin.GetSpecificRange(this._range).map((c) => c as Cell);
			}
			newCells.forEach((c) => {
				let item = new BasicItem(BoundingBox.CreateFromBox(c.GetBoundingBox()), Archive.selectionPower, 3);
				let animator = new BouncingScaleUpAnimator(item, [ Archive.selectionPower ]);
				item.SetAnimator(animator);
				item.SetVisible(() => true);
				item.SetAlive(() => true);
				this._animators.push(animator);
				this._items.push(item);
			});
			this._range += 1;
		}
	}
}
