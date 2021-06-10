import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { ZKind } from './../../Items/ZKind';
import { ILayerService } from './../../../Services/Layer/ILayerService';
import { IUpdateService } from '../../../Services/Update/IUpdateService';
import { InteractionKind } from '../../Interaction/IInteractionContext';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { BasicItem } from '../../Items/BasicItem';
import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { Point } from '../../Utils/Geometry/Point';
import { Cell } from '../../Items/Cell/Cell';
import { Item } from '../../Items/Item';
import { ViewContext } from '../../Utils/Geometry/ViewContext';
import * as PIXI from 'pixi.js';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { Singletons, SingletonKey } from '../../../Singletons';

export class MultiSelectionContext implements IInteractionContext {
	private _updateService: IUpdateService;
	private _layerService: ILayerService;
	public Kind: InteractionKind;
	public Point: PIXI.Point;
	private _cells: Dictionnary<Cell>;
	private _highlightingCells: BasicItem[];
	private _isOn: boolean;
	public View: ViewContext;
	public _isUnitSelection: boolean;
	private _viewport: any;
	constructor() {
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._viewport = this._layerService.GetViewport();
		this._cells = new Dictionnary<Cell>();
		this._highlightingCells = new Array<BasicItem>();
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
		return this._cells.Values();
	}

	public Close(): void {
		this._isOn = false;
		this._cells = new Dictionnary<Cell>();
		this._highlightingCells.forEach((c) => c.Destroy());
		this._highlightingCells = [];
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
