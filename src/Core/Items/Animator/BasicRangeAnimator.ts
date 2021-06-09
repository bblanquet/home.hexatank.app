import { ZKind } from './../ZKind';
import { FadeInOutAnimation } from './FadeInOutAnimation';
import { BoundingBox } from './../../Utils/Geometry/BoundingBox';
import { BasicItem } from './../BasicItem';
import { IAnimator } from './IAnimator';
import { Cell } from './../Cell/Cell';
import { SvgArchive } from '../../Framework/SvgArchiver';
export class BasicRangeAnimator implements IAnimator {
	public IsDone: boolean = false;
	private _items: BasicItem[];
	private _animators: IAnimator[];

	constructor(private _origin: Cell, private _totalRange: number) {
		this._items = [];
		this._animators = [];
	}

	Destroy(): void {
		this.IsDone = true;
		if (this._items) {
			this._items.forEach((e) => {
				e.Destroy();
			});
		}
		this._items = [];
		this._animators = [];
	}

	Reset(): void {
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

		if (0 < this._animators.length && this._animators.every((a) => a.IsDone)) {
			this.Reset();
			this.IsDone = true;
			return;
		}

		if (this._animators.length === 0) {
			let newCells = new Array<Cell>();

			for (let range = 0; range <= this._totalRange; range++) {
				newCells = newCells.concat(this._origin.GetSpecificRange(range).map((c) => c as Cell));
			}
			newCells.forEach((c) => {
				let item = new BasicItem(
					BoundingBox.CreateFromBox(c.GetBoundingBox()),
					SvgArchive.selectionPower,
					ZKind.Cell
				);
				let animator = new FadeInOutAnimation(item, SvgArchive.selectionPower, 0, 1, 0.02);
				item.SetAnimator(animator);
				item.SetAlive(() => true);
				item.SetVisible(() => true);
				this._animators.push(animator);
				this._items.push(item);
			});
		}
	}
}
