import { BasicField } from './../Items/Cell/Field/BasicField';
import { InteractionInfo } from './InteractionInfo';
import { LiteEvent } from './../../Utils/Events/LiteEvent';
import { IUpdateService } from './../../Services/Update/IUpdateService';
import { ICombination } from './Combination/ICombination';
import { InputNotifier } from './InputNotifier';
import { CombinationContext } from './Combination/CombinationContext';
import { IContextContainer } from './IContextContainer';
import * as PIXI from 'pixi.js';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { Point } from '../../Utils/Geometry/Point';
import { IInteractionContext, InteractionKind } from './IInteractionContext';
import { ISelectableChecker } from './ISelectableChecker';
import { ViewContext } from '../../Utils/Geometry/ViewContext';
import { Singletons, SingletonKey } from '../../Singletons';
import { IGameContext } from '../Framework/Context/IGameContext';
import { Env } from '../../Env';
import { LogKind } from '../../Utils/Logger/LogKind';
import { StaticLogger } from '../../Utils/Logger/StaticLogger';
import { UnitGroup } from '../Items/UnitGroup';

export class InteractionContext implements IContextContainer, IInteractionContext {
	private _updateService: IUpdateService;
	public Kind: InteractionKind;
	public Point: PIXI.Point;
	public View: ViewContext;
	private _selectedItem: Array<Item>;
	public OnError: LiteEvent<Error> = new LiteEvent<Error>();
	public OnInteractionChanged: LiteEvent<InteractionInfo> = new LiteEvent<InteractionInfo>();

	constructor(
		private _inputNotifier: InputNotifier,
		private _combinations: ICombination[],
		private _checker: ISelectableChecker,
		private _viewPort: any,
		private _gameContext: IGameContext
	) {
		this._updateService = Singletons.Load<IUpdateService>(SingletonKey.Update);
		this._selectedItem = [];
		this._combinations.forEach((combination) => {
			combination.ClearContext.On(this.HandleClearContext.bind(this));
			combination.ForcingSelectedItem.On(this.HandleForcingSelectedItem.bind(this));
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
		const cell = item as Cell;

		return (
			cell.GetOccupiers().some((oc) => this._checker.IsSelectable(oc)) ||
			this._checker.IsSelectable((cell.GetField() as any) as Item)
		);
	}

	private GetSelectable(cell: Cell): Item {
		if (cell.GetOccupiers().some((oc) => this._checker.IsSelectable(oc))) {
			return cell.GetOccupiers().find((oc) => this._checker.IsSelectable(oc));
		} else {
			if (cell.GetField() instanceof BasicField) {
				return cell;
			} else {
				return <Item>(<any>(<Cell>cell).GetField());
			}
		}
	}

	public OnSelect(item: Item): void {
		if (Env.IsPrd()) {
			try {
				this.Select(item);
			} catch (e) {
				if (e instanceof Error) {
					this.OnError.Invoke(this, e);
				}
			}
		} else {
			this.Select(item);
		}
	}

	private Select(item: Item): void {
		if (!this._gameContext.State.IsPause) {
			if (item) {
				if (item instanceof Cell && this.ContainsSelectable(item)) {
					item = this.GetSelectable(item);
				}
				this._selectedItem.push(item);
			}
			if (this.Kind !== InteractionKind.Moving) {
				const info = new InteractionInfo();
				info.InteractionKind = InteractionKind[this.Kind];
				info.ItemsCount = this._selectedItem.length;
				info.Items = this._selectedItem.map((s) => s.constructor.name);
				this.OnInteractionChanged.Invoke(this, info);
				if (!Env.IsPrd()) {
					StaticLogger.Log(LogKind.info, this.GetInteractionInfo());
				}
			}

			let context = new CombinationContext();
			context.Items = this._selectedItem;
			context.InteractionKind = this.Kind;
			context.Point = this.Point;

			this._combinations.some((combination) => {
				if (combination.Combine(context)) {
					if (!Env.IsPrd()) {
						StaticLogger.Log(LogKind.success, `combination: ${combination.constructor.name}`);
					}
					return true;
				}
				return false;
			});
		}
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

	private GetInteractionInfo() {
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
}
