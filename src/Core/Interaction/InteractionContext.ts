import { ICombination } from './Combination/ICombination';
import { InputNotifier } from './InputNotifier';
import { GameHelper } from '../Framework/GameHelper';
import { InteractionMode } from './InteractionMode';
import { CombinationContext } from './Combination/CombinationContext';
import { CombinationDispatcher } from './CombinationDispatcher';
import { IContextContainer } from './IContextContainer';
import * as PIXI from 'pixi.js';
import { Item } from '../Items/Item';
import { Cell } from '../Items/Cell/Cell';
import { ICombinationDispatcher } from './ICombinationDispatcher';
import { isNullOrUndefined } from 'util';
import { Point } from '../Utils/Geometry/Point';
import { IInteractionContext, InteractionKind } from './IInteractionContext';

export class InteractionContext implements IContextContainer, IInteractionContext {
	public Mode: InteractionMode = InteractionMode.SingleSelection;
	public Kind: InteractionKind;
	public Point: PIXI.Point;
	private _selectedItem: Array<Item>;
	private _dispatcher: ICombinationDispatcher;

	constructor(
		private _inputNotifier: InputNotifier,
		combinations: ICombination[],
		private _isSelectable: (item: Item) => boolean
	) {
		this._selectedItem = [];
		this._dispatcher = new CombinationDispatcher(combinations);
		combinations.forEach(c=>{
			c.OnChangedMod.On(this.)
		})
	}

	public Mute(): void {
		this._inputNotifier.MovingUpEvent.Off(this.MovingUp().bind(this));
		this._inputNotifier.UpEvent.Off(this.Up().bind(this));
		this._inputNotifier.HoldingEvent.Off(this.Holding().bind(this));
		this._inputNotifier.MovingUpEvent.Off(this.MovingUp().bind(this));
		this._inputNotifier.MovingEvent.Off(this.Moving().bind(this));
	}

	public Listen(): void {
		this._inputNotifier.UpEvent.On(this.Up().bind(this));
		this._inputNotifier.MovingUpEvent.On(this.MovingUp().bind(this));
		this._inputNotifier.DownEvent.On(this.Down().bind(this));
		this._inputNotifier.HoldingEvent.On(this.Holding());
		this._inputNotifier.MovingEvent.On(this.Moving());
	}

	private Moving(): (obj: any, data?: Point) => void {
		return (point: Point) => {
			this.Notify(InteractionKind.Moving, point);
		};
	}

	private Holding(): (obj: any, data?: Point) => void {
		return (point: Point) => {
			this.Notify(InteractionKind.Holding, point);
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
		if (this.Mode === InteractionMode.SingleSelection) {
			GameHelper.Playground.Select(this);
		} else {
			this.OnSelect(null);
		}
	}

	private ContainsSelectable(item: Item): Boolean {
		return (
			this._isSelectable(<Item>(<any>(<Cell>item).GetOccupier())) ||
			this._isSelectable(<Item>(<any>(<Cell>item).GetField()))
		);
	}

	private GetSelectable(i: Cell): Item {
		if (this._isSelectable(<Item>(<any>(<Cell>i).GetOccupier()))) {
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
			console.log(
				`%c [${this._selectedItem.length}] selected: ${item ? item.constructor.name : 'none'} ${InteractionMode[
					this.Kind
				]} ${InteractionMode[this.Mode]}`,
				'font-weight:bold;color:red;'
			);
		}

		let context = new CombinationContext();
		context.Items = this._selectedItem;
		context.InteractionKind = this.Kind;
		context.ContextMode = this.Mode;
		context.Point = this.Point;
		this._dispatcher.Check(context);
	}

	public Push(item: Item, forced: boolean): void {
		if (forced) {
			this.OnSelect(item);
		} else {
			this._selectedItem.push(item);
		}
	}

	ClearContext(): void {
		this._selectedItem = [];
	}
}
