import { IInteractionService } from './../../../Services/Interaction/IInteractionService';
import { lazyInject } from '../../../inversify.config';
import { IUpdateService } from '../../../Services/Update/IUpdateService';
import { InteractionKind } from '../../Interaction/IInteractionContext';
import { Archive } from '../../Framework/ResourceArchiver';
import { BasicItem } from '../../Items/BasicItem';
import { CellContext } from '../../Items/Cell/CellContext';
import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { Point } from '../../Utils/Geometry/Point';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { ViewContext } from '../../Utils/Geometry/ViewContext';
import * as PIXI from 'pixi.js';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { TYPES } from '../../../types';

export class MultiSelectionContext implements IInteractionContext {
	@lazyInject(TYPES.Empty) private _updateService: IUpdateService;
	@lazyInject(TYPES.Empty) private _interactionService: IInteractionService;
	public Kind: InteractionKind;
	public Point: PIXI.Point;
	private _cells: CellContext<Cell>;
	private _enlightCells: BasicItem[];
	private _isOn: boolean;
	public View: ViewContext;
	public _isUnitSelection: boolean;
	private _viewport: any;
	constructor() {
		this._viewport = this._interactionService.Publish();
		this._cells = new CellContext<Cell>();
		this._enlightCells = new Array<BasicItem>();
	}

	public Listen(isUnit: boolean): void {
		this._isOn = true;
		this._isUnitSelection = isUnit;
	}

	public IsListening(): boolean {
		return this._isOn;
	}

	public IsListeningCell(): boolean {
		return this._isOn && !this._isUnitSelection;
	}

	public IsListeningUnit(): boolean {
		return this._isOn && this._isUnitSelection;
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
			this._updateService.Publish().Items.forEach((item) => {
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
