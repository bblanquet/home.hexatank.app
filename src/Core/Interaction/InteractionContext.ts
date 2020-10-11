import { InteractionInfo } from './InteractionInfo';
import { LiteEvent } from './../Utils/Events/LiteEvent';
import { IUpdateService } from './../../Services/Update/IUpdateService';
import { UnitGroup } from '../Items/UnitGroup';
import { ICombination } from './Combination/ICombination';
import { InputNotifier } from './InputNotifier';
import { CombinationContext } from './Combination/CombinationContext';
import { CombinationDispatcher } from './CombinationDispatcher';
import { IContextContainer } from './IContextContainer';
import * as PIXI from 'pixi.js';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { ICombinationDispatcher } from './ICombinationDispatcher';
import { Point } from '../Utils/Geometry/Point';
import { IInteractionContext, InteractionKind } from './IInteractionContext';
import { ISelectableChecker } from './ISelectableChecker';
import { ViewContext } from '../Utils/Geometry/ViewContext';
import { isNullOrUndefined } from '../Utils/ToolBox';
import { Factory, FactoryKey } from '../../Factory';

export class InteractionContext implements IContextContainer, IInteractionContext {
	private _updateService: IUpdateService;
	public Kind: InteractionKind;
	public Point: PIXI.Point;
	public View: ViewContext;
	private _selectedItem: Array<Item>;
	private _dispatcher: ICombinationDispatcher;
	public OnInteractionChanged: LiteEvent<InteractionInfo> = new LiteEvent<InteractionInfo>();

	constructor(
		private _inputNotifier: InputNotifier,
		combinations: ICombination[],
		private _checker: ISelectableChecker,
		private _viewPort: any
	) {
		this._updateService = Factory.Load<IUpdateService>(FactoryKey.Update);
		this._selectedItem = [];
		this._dispatcher = new CombinationDispatcher(combinations);
		combinations.forEach((c) => {
			c.ClearContext.On(this.HandleClearContext.bind(this));
			c.ForcingSelectedItem.On(this.HandleForcingSelectedItem.bind(this));
		});
	}

	public Mute(): void {
		this._inputNotifier.MovingUpEvent.Off(this.MovingUp().bind(this));
		this._inputNotifier.UpEvent.Off(this.Up().bind(this));
		this._inputNotifier.DoubleEvent.Off(this.Doubling().bind(this));
		this._inputNotifier.MovingUpEvent.Off(this.MovingUp().bind(this));
		this._inputNotifier.MovingEvent.Off(this.Moving().bind(this));
	}

	public Listen(): void {
		this._inputNotifier.UpEvent.On(this.Up().bind(this));
		this._inputNotifier.MovingUpEvent.On(this.MovingUp().bind(this));
		this._inputNotifier.DownEvent.On(this.Down().bind(this));
		this._inputNotifier.DoubleEvent.On(this.Doubling());
		this._inputNotifier.MovingEvent.On(this.Moving());
	}

	private Moving(): (obj: any, data?: Point) => void {
		return (point: Point) => {
			this.Notify(InteractionKind.Moving, point);
		};
	}

	private Doubling(): (obj: any, data?: Point) => void {
		return (point: Point) => {
			this.Notify(InteractionKind.DoubleClick, point);
		};
	}

	private Down(): (obj: any, data?: Point) => void {
		return (point: Point) => {
			this.Notify(InteractionKind.Down, point);
		};
	}

	private Up(): (obj: any, data?: Point) => void {
		return (point: Point) => {
			this.NotifyContext(InteractionKind.Up, point);
		};
	}

	private MovingUp(): (obj: any, data?: Point) => void {
		return (point: Point) => {
			this.Notify(InteractionKind.MovingUp, point);
		};
	}

	private Notify(kind: InteractionKind, point: Point) {
		this.Point = new PIXI.Point(point.X, point.Y);
		this.Kind = kind;
		this.OnSelect(null);
	}

	private NotifyContext(kind: InteractionKind, point: Point) {
		this.Point = new PIXI.Point(point.X, point.Y);
		this.Kind = kind;
		if (this._viewPort.lastViewport) {
			this.View = new ViewContext();
			this.View.Scale = this._viewPort.lastViewport.scaleX;
			this.View.SetX(this._viewPort.left);
			this.View.SetY(this._viewPort.top);
		} else {
			this.View = null;
		}

		this._updateService.Publish().Select(this);
	}

	private ContainsSelectable(item: Item): Boolean {
		return (
			this._checker.IsSelectable(<Item>(<any>(<Cell>item).GetOccupier())) ||
			this._checker.IsSelectable(<Item>(<any>(<Cell>item).GetField()))
		);
	}

	private GetSelectable(i: Cell): Item {
		if (this._checker.IsSelectable(<Item>(<any>(<Cell>i).GetOccupier()))) {
			return <Item>(<any>(<Cell>i).GetOccupier());
		} else {
			return <Item>(<any>(<Cell>i).GetField());
		}
	}

	public OnSelect(item: Item): void {
		if (!isNullOrUndefined(item)) {
			if (item instanceof Cell) {
				if (this.ContainsSelectable(item)) {
					item = this.GetSelectable(item);
				}
			}
			this._selectedItem.push(item);
		}
		if (this.Kind !== InteractionKind.Moving) {
			const info = new InteractionInfo();
			info.InteractionKind = InteractionKind[this.Kind];
			info.ItemsCount = this._selectedItem.length;
			info.Items = this._selectedItem.map((s) => s.constructor.name);
			this.OnInteractionChanged.Invoke(this, info);
			console.log(`%c ${this.GetMessage()}`, 'font-weight:bold;color:red;');
		}

		let context = new CombinationContext();
		context.Items = this._selectedItem;
		context.InteractionKind = this.Kind;
		context.Point = this.Point;
		this._dispatcher.Check(context);
	}

	private GetMessage() {
		return `COUNT[${this._selectedItem.length}] ITEMS[ ${this._selectedItem.map(
			(e) => `${e.constructor.name} `
		)}] INT[${InteractionKind[this.Kind]}] ${this.GetDetail(this._selectedItem)}`;
	}

	private HasGroup(items: Item[]): boolean {
		return 0 < items.length && items[0] instanceof UnitGroup;
	}

	private GetDetail(items: Item[]) {
		if (!this.HasGroup(items)) {
			return '';
		}
		return `GROUPLISTENING[${(items[0] as UnitGroup).IsListeningOrder}]`;
	}

	public HandleForcingSelectedItem(obj: any, data: { item: Item; isForced: boolean }): void {
		if (data.isForced) {
			this.OnSelect(data.item);
		} else {
			this._selectedItem.push(data.item);
		}
	}

	HandleClearContext(): void {
		this._selectedItem = [];
	}
}
