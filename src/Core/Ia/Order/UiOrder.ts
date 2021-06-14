import { OrderState } from './OrderState';
import { Cell } from './../../Items/Cell/Cell';
import { BasicItem } from '../../Items/BasicItem';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { BouncingScaleUpAnimator } from '../../Items/Animator/BouncingScaleUpAnimator';
import { IOrder } from './IOrder';
import { ZKind } from '../../Items/ZKind';

export class UiOrder {
	private _items: Dictionnary<BasicItem>;
	private _order: IOrder;

	public HasOrder(order: IOrder): boolean {
		return order === this._order;
	}

	private PathCreated(src: any, cells: Cell[]): void {
		this.SetCellUi(cells);
	}

	private SetCellUi(cells: Cell[]) {
		const keys = cells.map((c) => c.Coo());
		//remove old keys
		this._items.Keys().forEach((key) => {
			if (!keys.some((k) => k === key)) {
				this.Destroy(key);
			}
		});

		//add new keys
		cells.forEach((cell) => {
			if (!this._items.Exist(cell.Coo())) {
				var pathItem = new BasicItem(cell.GetBoundingBox(), SvgArchive.direction.moving, ZKind.Cell);
				pathItem.SetAnimator(new BouncingScaleUpAnimator(pathItem, [SvgArchive.direction.moving]));
				pathItem.SetVisible(() => true);
				pathItem.SetAlive(() => true);
				this._items.Add(cell.Coo(), pathItem);
			}
		});
	}

	private NextCell(src: any, cell: Cell): void {
		this.Destroy(cell.Coo());
	}
	private StateChanged(src: any, state: OrderState): void {
		if (this._order.IsDone()) {
			this.Clear();
		}
	}

	private Destroy(key: string) {
		if (this._items.Exist(key)) {
			const c = this._items.Get(key);
			c.Destroy();
			this._items.Remove(key);
		}
	}

	public AddOrder(order: IOrder) {
		if (this._order) {
			this.Clear();
		}
		this._order = order;
		this._order.OnPathFound.On(this.PathCreated.bind(this));
		this._order.OnNextStep.On(this.NextCell.bind(this));
		this._order.OnStateChanged.On(this.StateChanged.bind(this));
		this._items = new Dictionnary<BasicItem>();
		this.SetCellUi(this._order.GetPath());
	}

	private Clear() {
		if (this._order) {
			this._order.OnPathFound.Clear();
			this._order.OnNextStep.Clear();
			this._order.OnStateChanged.Clear();
		}
		if (this._items) {
			this._items.Keys().forEach((key) => {
				this.Destroy(key);
			});
		}
	}
}
