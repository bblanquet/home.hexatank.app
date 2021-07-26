import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { ZKind } from './../../Items/ZKind';
import { ILayerService } from './../../../Services/Layer/ILayerService';
import { IUpdateService } from '../../../Services/Update/IUpdateService';
import { InteractionKind } from '../../Interaction/IInteractionContext';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { BasicItem } from '../../Items/BasicItem';
import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { Point } from '../../../Utils/Geometry/Point';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { ViewContext } from '../../../Utils/Geometry/ViewContext';
import * as PIXI from 'pixi.js';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { Singletons, SingletonKey } from '../../../Singletons';
import { SimpleEvent } from '../../../Utils/Events/SimpleEvent';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';

export class MultiSelectionContext implements IInteractionContext {
	private _updateService: IUpdateService;
	private _layerService: ILayerService;

	public SelectionKind: SelectionKind;
	public Kind: InteractionKind;

	public Point: PIXI.Point;
	private _cells: Dictionary<Cell>;
	private _highlightingCells: BasicItem[];
	public View: ViewContext;
	private _viewport: any;

	public OnModeChanged: LiteEvent<SelectionKind> = new LiteEvent<SelectionKind>();
	public OnSelectionChanged: SimpleEvent = new SimpleEvent();

	constructor() {
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._viewport = this._layerService.GetViewport();
		this._cells = new Dictionary<Cell>();
		this._highlightingCells = new Array<BasicItem>();
	}

	public Listen(isUnit: boolean): void {
		this.SelectionKind = isUnit ? SelectionKind.Vehicle : SelectionKind.Cell;
		this.OnSelectionChanged.Invoke();
		this.OnModeChanged.Invoke(this, this.SelectionKind);
	}

	public IsListening(): boolean {
		return this.SelectionKind !== SelectionKind.None;
	}

	public GetSelectionKind(): SelectionKind {
		return this.SelectionKind;
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

		if (this.IsListening()) {
			this._updateService.Publish().Items.forEach((item) => {
				item.Select(this);
			});
		}
	}

	public GetCells(): Cell[] {
		return this._cells.Values();
	}

	public Close(): void {
		this.SelectionKind = SelectionKind.None;
		this._cells = new Dictionary<Cell>();
		this._highlightingCells.forEach((c) => c.Destroy());
		this._highlightingCells = [];
		this.OnSelectionChanged.Invoke();
		this.OnModeChanged.Invoke(this, this.SelectionKind);
	}

	public OnSelect(item: Item): void {
		if (isNullOrUndefined(item)) {
			return;
		}

		if (item instanceof Cell) {
			const cell = <Cell>item;
			if (this._cells.Get(cell.Coo()) === null) {
				this._cells.Add(cell.Coo(), cell);
				const displayPath = new BasicItem(
					cell.GetBoundingBox(),
					SvgArchive.menu.smartMenu.multiCellSelection,
					ZKind.Sky
				);
				displayPath.SetAlive(() => true);
				displayPath.SetVisible(() => true);
				this._highlightingCells.push(displayPath);
			}
		}
	}
}

export enum SelectionKind {
	None,
	Cell,
	Vehicle
}
