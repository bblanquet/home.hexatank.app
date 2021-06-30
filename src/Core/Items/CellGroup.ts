import { ISelectable } from '../ISelectable';
import { Item } from './Item';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { IInteractionContext } from '../Interaction/IInteractionContext';
import { Cell } from './Cell/Cell';

export class CellGroup extends Item implements ISelectable {
	private _cells: Array<Cell> = new Array<Cell>();
	OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();

	constructor() {
		super(false);
	}

	SetCells(cells: Array<Cell>): void {
		this._cells = cells;
	}

	Clear(): void {
		this._cells.forEach((u) => {
			u.SetSelected(false);
		});
		this._cells = [];
	}

	GetCells(): Array<Cell> {
		return this._cells;
	}

	Any(): boolean {
		return 0 < this._cells.length;
	}

	SetSelected(visible: boolean): void {
		if (!visible) {
			this.Clear();
		} else {
			this._cells.forEach((v) => {
				v.SetSelected(visible);
			});
		}
		this.OnSelectionChanged.Invoke(this, this);
	}
	IsSelected(): boolean {
		return this.Any();
	}

	public GetBoundingBox(): BoundingBox {
		throw new Error('Method not implemented.');
	}
	public Select(context: IInteractionContext): boolean {
		context.OnSelect(this);
		return true;
	}
}
