import { Identity } from './../Identity';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { ReactorField } from './Field/Bonus/ReactorField';
import { ZKind } from './../ZKind';
import { ILiteEvent } from './../../Utils/Events/ILiteEvent';
import { BouncingScaleDownAnimator } from './../Animator/BouncingScaleDownAnimator';
import { IAnimator } from './../Animator/IAnimator';
import { Item } from '../Item';
import { CellProperties } from './CellProperties';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { IField } from './Field/IField';
import { AliveItem } from '../AliveItem';
import { BasicField } from './Field/BasicField';
import { CellState } from './CellState';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { ISelectable } from '../../ISelectable';
import { Headquarter } from './Field/Hq/Headquarter';
import { ICell } from './ICell';
import { IMovable } from '../IMovable';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { Point } from '../../Utils/Geometry/Point';
import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Vehicle } from '../Unit/Vehicle';
import { GameSettings } from '../../Framework/GameSettings';
import * as PIXI from 'pixi.js';
import { MultiSelectionContext } from '../../Menu/Smart/MultiSelectionContext';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { BonusField } from './Field/Bonus/BonusField';
import { InfiniteFadeAnimation } from '../Animator/InfiniteFadeAnimation';
import { BasicItem } from '../BasicItem';
import { IHeadquarter } from './Field/Hq/IHeadquarter';
import { TypeTranslator } from './Field/TypeTranslator';

export class Cell extends Item implements ICell<Cell>, ISelectable {
	private _selectionCircle: PIXI.Circle;
	public Properties: CellProperties;

	//state
	private _state: CellState = CellState.Hidden;
	private _isAlwaysVisible: boolean = false;
	private _isSelectable = false;
	private _field: IField;

	//events
	public OnFieldChanged: ILiteEvent<Cell> = new LiteEvent<Cell>();
	public OnVehicleChanged: ILiteEvent<Vehicle> = new LiteEvent<Vehicle>();
	public OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();

	private _cellStateSprites: Dictionnary<Array<string>>;
	private _occupier: IMovable;
	private _decorationSprite: string;
	private _shadowAnimator: IAnimator = null;

	private _blueSelection: BasicItem;
	private _whiteSelection: BasicItem;

	private _playerHq: IHeadquarter = null;

	constructor(properties: CellProperties, private _cells: Dictionnary<Cell>) {
		super();
		this.Z = ZKind.Cell;
		this._cellStateSprites = new Dictionnary<Array<string>>();
		this.Properties = properties;
		new BasicField(this);
		this.IsCentralRef = true;
		this.GenerateSprite(SvgArchive.selectionCell);
		this.SetProperty(SvgArchive.selectionCell, (e) => {
			e.alpha = 0;
			e.anchor.set(0.5);
		});
		this._selectionCircle = new PIXI.Circle(0, 0, GameSettings.Size / 2);
		this.SetSelectionAnimation();
	}

	public Listen(): void {
		this.OnFieldChanged.On(this.UpdateSelectable.bind(this));
		this.GetNearby(1).forEach((cell) => {
			cell.OnFieldChanged.On(this.UpdateSelectable.bind(this));
			cell.OnVehicleChanged.On(this.UpdateSelectable.bind(this));
		});
	}

	public SetPlayerHq(playerHq: IHeadquarter): void {
		this._playerHq = playerHq;
	}

	public IsSelectable(): boolean {
		return this._isSelectable;
	}

	public SetSelectionAnimation(): void {
		this._whiteSelection = new BasicItem(this.GetBoundingBox(), SvgArchive.selectionWhiteCell, ZKind.BelowCell);
		this._whiteSelection.SetVisible(() => this._isSelectable);
		this._whiteSelection.SetAlive(() => true);

		this._blueSelection = new BasicItem(this.GetBoundingBox(), SvgArchive.selectionBlueCell, ZKind.BelowCell);
		this._blueSelection.SetAnimator(
			new InfiniteFadeAnimation(this._blueSelection, SvgArchive.selectionBlueCell, 0, 1, 0.02)
		);
		this._blueSelection.SetVisible(() => this._isSelectable);
		this._blueSelection.SetAlive(() => true);

		this.GetUnblockedRange();
	}

	GetDistance(item: Cell): number {
		return this.GetHexCoo().GetDistance(item.GetHexCoo());
	}

	IsEqualed(item: Cell): boolean {
		return this === item;
	}

	public UpdateSelectable(src: any, data: any): void {
		if (!this._playerHq) {
			this._isSelectable = false;
		} else {
			const identity = this._playerHq.Identity;
			const filter = (cell: Cell) => cell && (cell.HasAlly(identity) || !cell.IsFoeField(identity));
			const anyAlly = this.GetFilteredNearby(filter).length > 0;
			this._isSelectable =
				(this.IsVisible() && this._field instanceof BasicField && anyAlly) || this.HasAlly(identity);
		}
	}

	public GetState(): CellState {
		return this._state;
	}

	public OnCellStateChanged: LiteEvent<CellState> = new LiteEvent<CellState>();

	private HandleCellStateChanged(state: CellState) {
		if (this._isAlwaysVisible) {
			this._state = CellState.Visible;
			this.OnCellStateChanged.Invoke(this, this._state);
			return;
		}

		this._state = state;
		this.OnCellStateChanged.Invoke(this, this._state);
	}

	public IsVisible(): boolean {
		return this._state === CellState.Visible;
	}

	public SetSelected(isSelected: boolean): void {
		this.SetSelectedAppareance(isSelected);
		this.OnSelectionChanged.Invoke(this, this);
	}
	public IsSelected(): boolean {
		return this.GetCurrentSprites().Get(SvgArchive.selectionCell).alpha === 1;
	}

	public AlwaysVisible() {
		this._isAlwaysVisible = true;
		this._state = CellState.Visible;
	}

	public GetOccupier(): IMovable {
		return this._occupier;
	}

	public GetField(): IField {
		return this._field;
	}

	public SetField(field: IField): void {
		this._field = field;
		const occ = this.GetOccupier();
		if (occ instanceof Vehicle) {
			this._field.SetPowerUp(occ);
		}
	}

	public HasOccupier(): boolean {
		return !isNullOrUndefined(this._occupier);
	}

	public HasAroundOccupier(): boolean {
		return this.HasOccupier() || this.GetNearby().filter((c) => (<Cell>c).HasOccupier()).length > 0;
	}

	public HasAroundAlly(a: Identity): boolean {
		return this.HasAlly(a) || this.GetNearby().filter((c) => (<Cell>c).HasAlly(a)).length > 0;
	}

	public SetOccupier(movable: IMovable) {
		this._occupier = movable;
	}

	public IsBlocked(): boolean {
		return (!isNullOrUndefined(this._field) && this._field.IsBlocking()) || this._occupier != null;
	}

	public HasBlockingField(): boolean {
		return !isNullOrUndefined(this._field) && this._field.IsBlocking();
	}

	public HasShootableField(): boolean {
		return this._field.IsDesctrutible();
	}

	public IsShootable(): boolean {
		return this._field.IsDesctrutible() || this._occupier != null;
	}

	public GetShootableEntity(): AliveItem {
		if (this._occupier != null) {
			if (this._occupier instanceof Vehicle) {
				const vehicle = this._occupier as Vehicle;
				if (vehicle.GetCurrentCell() === this) {
					return vehicle;
				}
			} else {
				return <AliveItem>(this._occupier as any);
			}
		}

		if (!isNullOrUndefined(this._field)) {
			if (this._field.IsDesctrutible()) {
				return <AliveItem>(<any>this._field);
			}
		}

		return null;
	}

	public HasAlly(id: Identity): boolean {
		if (this._occupier && this._occupier instanceof AliveItem) {
			return !this._occupier.IsEnemy(id);
		}
		if (this._field && this._field instanceof Headquarter) {
			return !this._field.IsEnemy(id);
		}
		return false;
	}

	public IsFoeField(identity: Identity): boolean {
		return identity.IsEnemy(this.GetField().GetIdentity());
	}

	public HasEnemy(v: AliveItem): boolean {
		if (this._occupier && this._occupier instanceof AliveItem) {
			if (v instanceof Vehicle && (<Vehicle>v).HasCamouflage) {
				return false;
			}
			return v.IsEnemy(this._occupier.Identity);
		}
		if (this._field && this._field instanceof Headquarter) {
			return v.IsEnemy(this._field.Identity);
		}
		return false;
	}

	public GetBoundingBox(): BoundingBox {
		return this.Properties.BoundingBox;
	}

	protected SetSelectedAppareance(isSelected: boolean) {
		this.SetProperty(SvgArchive.selectionCell, (e) => (e.alpha = isSelected ? 1 : 0));
	}

	public SetState(state: CellState): void {
		const isDiscovered = this._state === CellState.Hidden && state !== CellState.Hidden;

		const isSelected = this.IsSelected();
		this.GetSprites().forEach((sprite) => (sprite.alpha = 0));
		this.SetSelectedAppareance(isSelected);
		state = this.SetHqState(state);

		this.HandleCellStateChanged(state);

		this._cellStateSprites.Get(CellState[this._state]).forEach((sprite) => {
			this.SetProperty(sprite, (e) => (e.alpha = 1));
		});

		if (isDiscovered) {
			this.SetProperty(SvgArchive.hiddenCell, (e) => (e.alpha = 1));
			this._shadowAnimator = new BouncingScaleDownAnimator(this, [ SvgArchive.hiddenCell ]);
		}
	}

	//awfull
	private SetHqState(state: CellState) {
		let cells = new Array<Cell>();
		if (this._playerHq && this._playerHq.GetCell()) {
			cells.push(this._playerHq.GetCell());
			cells = cells.concat(this._playerHq.GetCell().GetNearby());
			if (cells.indexOf(this) !== -1) {
				state = CellState.Visible;
			}
			return state;
		} else {
			return CellState.Visible;
		}
	}

	public Coo(): string {
		return this.GetHexCoo().ToString();
	}

	public SetDecoration(sprite: string): void {
		const random = Math.random();
		this.GenerateSprite(sprite, (s) => {
			s.alpha = 0;
			s.anchor.set(0.5);
			s.rotation += random * 360;
		});
		this._decorationSprite = sprite;
	}

	public InitSprite(): void {
		this.GenerateSprite(SvgArchive.hiddenCell, (s) => {
			s.anchor.set(0.5);
			s.alpha = 1;
		});

		this.GenerateSprite(SvgArchive.halfVisibleCell, (s) => {
			s.anchor.set(0.5);
			s.alpha = 0;
		});

		this.GenerateSprite(SvgArchive.cell, (s) => {
			s.anchor.set(0.5);
			s.alpha = 0;
		});

		this._cellStateSprites.Add(CellState[CellState.Hidden], [ SvgArchive.hiddenCell ]);

		if (isNullOrUndefined(this._decorationSprite)) {
			this._cellStateSprites.Add(CellState[CellState.Mist], [ SvgArchive.halfVisibleCell, SvgArchive.cell ]);
			this._cellStateSprites.Add(CellState[CellState.Visible], [ SvgArchive.cell ]);
		} else {
			this._cellStateSprites.Add(CellState[CellState.Mist], [
				SvgArchive.halfVisibleCell,
				this._decorationSprite,
				SvgArchive.cell
			]);
			this._cellStateSprites.Add(CellState[CellState.Visible], [ this._decorationSprite, SvgArchive.cell ]);
		}
		this.InitPosition(this.Properties.BoundingBox);
	}

	public GetHexCoo(): HexAxial {
		return this.Properties.Coordinate;
	}

	public GetCentralPoint(): Point {
		return this.Properties.GetCentralPoint();
	}

	public GetAll(range: number = 1): Array<Cell> {
		var cells = new Array<Cell>();
		cells.push(this);
		this.GetHexCoo().GetNeighbours(range).forEach((coo) => {
			var cell = this._cells.Get(coo.ToString());
			if (cell) {
				cells.push(cell);
			}
		});
		return cells;
	}

	public GetIncludedRange(range: number = 1): Array<Cell> {
		var cells = new Array<Cell>();
		for (let index = 1; index <= range; index++) {
			this.GetHexCoo().GetSpecificRange(index).forEach((coo) => {
				var cell = this._cells.Get(coo.ToString());
				if (cell) {
					cells.push(cell);
				}
			});
		}
		return cells;
	}

	public GetRange(range: number = 1): Array<Cell> {
		var cells = new Array<Cell>();
		this.GetHexCoo().GetSpecificRange(range).forEach((coo) => {
			var cell = this._cells.Get(coo.ToString());
			if (cell) {
				cells.push(cell);
			}
		});
		return cells;
	}

	public GetUnblockedRange(range: number = 1): Array<Cell> {
		let cells = new Array<Cell>();
		this.GetHexCoo().GetNeighbours(range).forEach((coo) => {
			let cell = this._cells.Get(coo.ToString());
			if (cell != null && !cell.IsBlocked()) {
				cells.push(cell);
			}
		});
		return cells;
	}

	public GetNearby(range: number = 1): Array<Cell> {
		var cells = new Array<Cell>();
		this.GetHexCoo().GetNeighbours(range).forEach((coo) => {
			var cell = this._cells.Get(coo.ToString());
			if (cell) {
				cells.push(cell);
			}
		});
		return cells;
	}

	public GetFilteredNearby(filter: (cell: Cell) => boolean): Array<Cell> {
		let cells = new Array<Cell>();
		this.GetHexCoo().GetNeighbours(1).forEach((coo) => {
			let cell = this._cells.Get(coo.ToString());
			if (filter(cell)) {
				cells.push(cell);
			}
		});
		return cells;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);
		this._whiteSelection.Update(viewX, viewY);
		this._blueSelection.Update(viewX, viewY);

		if (this._shadowAnimator) {
			if (this._shadowAnimator.IsDone) {
				this._shadowAnimator = null;
			} else {
				this._shadowAnimator.Update(viewX, viewY);
			}
		}
	}

	public Select(context: IInteractionContext): boolean {
		if (context.View) {
			let scale = context.View.Scale;
			this._selectionCircle.radius = //a bit ulgy MultiSelectionContext
				context instanceof MultiSelectionContext ? GameSettings.Size / 2 * scale : GameSettings.Size * scale;
			this._selectionCircle.radius = GameSettings.Size * scale;
			this._selectionCircle.x = (this.GetSprites()[0].x - context.View.GetX()) * scale;
			this._selectionCircle.y = (this.GetSprites()[0].y - context.View.GetY()) * scale;
		}

		var isSelected = this._selectionCircle.contains(context.Point.x, context.Point.y);
		if (isSelected) {
			// console.log(`%c Q:${this.GetHexCoo().Q} R:${this.GetHexCoo().R}`, 'color:blue;font-weight:bold;');
			// console.log(
			// 	`%c X:${this.GetHexCoo().ToOffset().M} Y:${this.GetHexCoo().ToOffset().N}`,
			// 	'color:red;font-weight:bold;'
			// );
			context.OnSelect(this);
		}
		return false;
	}
}
