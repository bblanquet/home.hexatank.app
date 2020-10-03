import { OrderState } from './OrderState';
import { Cell } from './../../Items/Cell/Cell';
import { BasicItem } from '../../Items/BasicItem';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { Archive } from '../../Framework/ResourceArchiver';
import { BouncingScaleUpAnimator } from '../../Items/Animator/BouncingScaleUpAnimator';
import { IOrder } from './IOrder';

export class UiOrder {
	private _uiPath: Dictionnary<BasicItem>;
	constructor(private _order: IOrder) {
		this._order.OnPathCreated.On(this.HandleCreatedGoals.bind(this));
		this._order.OnNextCell.On(this.HandleNextCell.bind(this));
		this._order.OnStateChanged.On(this.HandleStateChanged.bind(this));
		this._uiPath = new Dictionnary<BasicItem>();
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
		this._uiPath.Keys().forEach((key) => {
			if (!keys.some((k) => k === key)) {
				this.Destroy(key);
			}
		});

		//add new keys
		cells.forEach((cell) => {
			if (!this._uiPath.Exist(cell.Coo())) {
				var pathItem = new BasicItem(cell.GetBoundingBox(), Archive.direction.moving);
				pathItem.SetAnimator(new BouncingScaleUpAnimator(pathItem, [ Archive.direction.moving ]));
				pathItem.SetVisible(() => true);
				pathItem.SetAlive(() => true);
				this._uiPath.Add(cell.Coo(), pathItem);
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
		const c = this._uiPath.Get(key);
		this._uiPath.Remove(key);
		c.Destroy();
	}

	public Clear() {
		if (this._uiPath) {
			this._uiPath.Keys().forEach((key) => {
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
