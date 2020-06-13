import { InteractionKind } from '../../Interaction/IInteractionContext';
import { isNullOrUndefined } from 'util';
import { Archive } from '../../Framework/ResourceArchiver';
import { BasicItem } from '../../Items/BasicItem';
import { CellContext } from '../../Items/Cell/CellContext';
import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { GameHelper } from '../../Framework/GameHelper';
import { Point } from '../../Utils/Geometry/Point';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { InteractionMode } from '../../Interaction/InteractionMode';
import { ViewContext } from '../../Utils/Geometry/ViewContext';
import * as PIXI from 'pixi.js';

export class MultiSelectionContext implements IInteractionContext {
	public Kind: InteractionKind;
	public Mode: InteractionMode;
	public Point: PIXI.Point;
	private _cells: CellContext<Cell>;
	private _enlightCells: BasicItem[];
	private _isOn: boolean;
	public View: ViewContext;

	constructor(private _viewport: any) {
		this._cells = new CellContext<Cell>();
		this._enlightCells = new Array<BasicItem>();
	}

	public Listen(): void {
		this._isOn = true;
	}

	public Moving(point: Point): void {
		this.Point = new PIXI.Point(point.X, point.Y);
		if (this._viewport.lastViewport) {
			this.View = new ViewContext();
			this.View.Scale = this._viewport.lastViewport.scaleX;
			this.View.SetX(this._viewport.left);
			this.View.SetY(this._viewport.top);
		} else {
			this.View = null;
		}

		if (this._isOn) {
			GameHelper.Updater.Items.forEach((item) => {
				item.Select(this);
			});
		}
	}

	public GetCells(): Cell[] {
		return this._cells.All();
	}

	public Close(): void {
		this._isOn = false;
		this._cells = new CellContext();
		this._enlightCells.forEach((c) => c.Destroy());
		this._enlightCells = [];
	}

	public OnSelect(item: Item): void {
		if (isNullOrUndefined(item)) {
			return;
		}

		if (item instanceof Cell) {
			const cell = <Cell>item;
			if (this._cells.Get(cell.GetCoordinate()) === null) {
				this._cells.Add(cell);
				const displayPath = new BasicItem(cell.GetBoundingBox(), Archive.menu.smartMenu.multiCellSelection, 5);
				displayPath.SetAlive(() => true);
				displayPath.SetVisible(() => true);
				this._enlightCells.push(displayPath);
			}
		}
	}
}
