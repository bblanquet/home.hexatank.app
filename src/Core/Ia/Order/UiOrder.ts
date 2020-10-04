import { OrderState } from './OrderState';
import { Cell } from './../../Items/Cell/Cell';
import { BasicItem } from '../../Items/BasicItem';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { Archive } from '../../Framework/ResourceArchiver';
import { BouncingScaleUpAnimator } from '../../Items/Animator/BouncingScaleUpAnimator';
import { IOrder } from './IOrder';
import { ZKind } from '../../Items/ZKind';

export class UiOrder {
	private _items: Dictionnary<BasicItem>;
	constructor(private _order: IOrder) {
		this._order.OnPathCreated.On(this.HandleCreatedGoals.bind(this));
		this._order.OnNextCell.On(this.HandleNextCell.bind(this));
		this._order.OnStateChanged.On(this.HandleStateChanged.bind(this));
		this._items = new Dictionnary<BasicItem>();
		this.SetCells(this._order.GetCells());
	}

	public HasOrder(order: IOrder): boolean {
		return order === this._order;
	}

	private HandleCreatedGoals(src: any, cells: Cell[]): void {
		this.SetCells(cells);
	}

	private SetCells(cells: Cell[]) {
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
				var pathItem = new BasicItem(cell.GetBoundingBox(), Archive.direction.moving, ZKind.Cell);
				pathItem.SetAnimator(new BouncingScaleUpAnimator(pathItem, [ Archive.direction.moving ]));
				pathItem.SetVisible(() => true);
				pathItem.SetAlive(() => true);
				this._items.Add(cell.Coo(), pathItem);
			}
		});
	}

	private HandleNextCell(src: any, cell: Cell): void {
		this.Destroy(cell.Coo());
	}
	private HandleStateChanged(src: any, state: OrderState): void {
		if (this._order.IsDone()) {
			this.Clear();
		}
	}

	private Destroy(key: string) {
		if (this._items.Exist(key)) {
			const c = this._items.Get(key);
			this._items.Remove(key);
			c.Destroy();
		}
	}

	public Clear() {
		if (this._items) {
			this._items.Keys().forEach((key) => {
				this.Destroy(key);
			});
		}

		if (this._order) {
			this._order.OnPathCreated.Off(this.HandleCreatedGoals.bind(this));
			this._order.OnNextCell.Off(this.HandleNextCell.bind(this));
			this._order.OnStateChanged.Off(this.HandleStateChanged.bind(this));
		}
	}
}
