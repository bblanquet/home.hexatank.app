import { Identity, Relationship } from './../Identity';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { ZKind } from './../ZKind';
import { ILiteEvent } from './../../../Utils/Events/ILiteEvent';
import { BouncingScaleDownAnimator } from './../Animator/BouncingScaleDownAnimator';
import { IAnimator } from './../Animator/IAnimator';
import { Item } from '../Item';
import { CellProperties } from './CellProperties';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { IField } from './Field/IField';
import { AliveItem } from '../AliveItem';
import { BasicField } from './Field/BasicField';
import { CellState } from './CellState';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { ISelectable } from '../../ISelectable';
import { ICell } from './ICell';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { Point } from '../../../Utils/Geometry/Point';
import { IInteractionContext } from '../../Interaction/IInteractionContext';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { Vehicle } from '../Unit/Vehicle';
import { GameSettings } from '../../Framework/GameSettings';
import * as PIXI from 'pixi.js';
import { MultiSelectionContext } from '../../Menu/Smart/MultiSelectionContext';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { InfiniteFadeAnimation } from '../Animator/InfiniteFadeAnimation';
import { BasicItem } from '../BasicItem';
import { TypeTranslator } from './Field/TypeTranslator';
import { StaticLogger } from '../../../Utils/Logger/StaticLogger';
import { LogKind } from '../../../Utils/Logger/LogKind';
import { ErrorCat, ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';

export class Cell extends Item implements ICell<Cell>, ISelectable {
	private _hitbox: PIXI.Circle;
	private _multihitbox: PIXI.Circle;
	public Properties: CellProperties;

	//state
	private _state: CellState = CellState.Hidden;
	private _isAlwaysVisible: boolean = false;
	private _isSelectable = false;
	private _field: IField;

	//events
	public OnFieldChanged: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnVehicleChanged: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();
	public OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();

	private _cellStateSprites: Dictionary<Array<string>>;
	private _occupiers: Vehicle[];
	private _decorationSprite: string;
	private _shadowAnimator: IAnimator = null;

	private _blueSelection: BasicItem;
	private _whiteSelection: BasicItem;

	private _playerIdentity: Identity = null;

	private _destroyedFieldFunc: any = this.HandleFieldDestroyed.bind(this);
	private _circle = new PIXI.Graphics();
	private _multiCircle = new PIXI.Graphics();

	constructor(properties: CellProperties, private _cells: Dictionary<Cell>) {
		super();
		this._occupiers = [];
		this.Z = ZKind.Cell;
		this._cellStateSprites = new Dictionary<Array<string>>();
		this.Properties = properties;
		this.SetField(new BasicField(this));
		this.IsCentralRef = true;
		this.GenerateSprite(SvgArchive.selectionCell);
		this.SetProperty(SvgArchive.selectionCell, (e) => {
			e.alpha = 0;
			e.anchor.set(0.5);
		});
		this.Push(this._circle);
		this.Push(this._multiCircle);
		this.SetSelectionAnimation();
		this._hitbox = new PIXI.Circle(0, 0, this.GetBoundingBox().GetWidth() / 2);
		this._multihitbox = new PIXI.Circle(0, 0, this.GetBoundingBox().GetWidth() / 3);
	}

	private HandleFieldDestroyed(src: any, field: Item): void {
		field.OnDestroyed.Off(this._destroyedFieldFunc);
		if (this.IsUpdatable) {
			this.SetField(new BasicField(this));
		}
	}

	public Listen(): void {
		this.OnFieldChanged.On(this.UpdateSelectable.bind(this));
		this.GetNearby(1).forEach((cell) => {
			cell.OnFieldChanged.On(this.UpdateSelectable.bind(this));
			cell.OnVehicleChanged.On(this.UpdateSelectable.bind(this));
		});
	}

	public SetPlayerHq(playerHq: Identity): void {
		this._playerIdentity = playerHq;
	}

	public IsSelectable(): boolean {
		return this._isSelectable;
	}

	public IsOverOccupied(): boolean {
		return 1 < this.GetOccupiers().length;
	}

	public SetSelectionAnimation(): void {
		this._whiteSelection = new BasicItem(this.GetBoundingBox(), SvgArchive.selectionWhiteCell, ZKind.BelowCell);
		this._whiteSelection.SetVisible(() => this._isSelectable);
		this._whiteSelection.SetAlive(() => true);

		this._blueSelection = new BasicItem(this.GetBoundingBox(), SvgArchive.selectionBlueCell, ZKind.BelowCell);
		this._blueSelection.SetAnimator(
			new InfiniteFadeAnimation(this._blueSelection, SvgArchive.selectionBlueCell, 0, 1, 0.05)
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

	public UnloadCell() {
		if (
			this.IsOverOccupied() &&
			this.GetOccupiers().every((e) => e.GetCurrentCell() === this && !e.HasNextCell())
		) {
			const units = this.GetOccupiers();
			const sortNames = units.map((e) => e.Id).sort((a, b) => a.localeCompare(b));
			sortNames.forEach((unitName, index) => {
				if (0 < index) {
					const unit = units.find((u) => u.Id === unitName);
					const freeCell = this.GetNearby(1).find((c) => c && TypeTranslator.IsAccessible(c, unit));
					if (freeCell) {
						unit.SetNextCell(freeCell);
					}
				}
			});
		}
	}

	public UpdateSelectable(src: any, data: any): void {
		if (!this._playerIdentity) {
			this._isSelectable = false;
		} else {
			const hasFoeFilter = (cell: Cell) => cell && TypeTranslator.HasFoeVehicle(cell, this._playerIdentity);
			const noFoe = this.GetFilteredNearby(hasFoeFilter).length === 0;
			this._isSelectable =
				this._field instanceof BasicField &&
				this.IsVisible() &&
				noFoe &&
				this.HasAllyNearby(this._playerIdentity);
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
	}

	public GetOccupiers(): Vehicle[] {
		this._occupiers = this._occupiers.filter((o) => o.IsAlive());
		return this._occupiers;
	}

	public GetField(): IField {
		return this._field;
	}

	public SetField<T extends IField>(nextField: T): T {
		if (!((nextField as any) as Item).IsUpdatable) {
			//self Destroyed field is not covered by reactor
			return;
		}

		if (!nextField) {
			ErrorHandler.Throw(ErrorCat.invalidParameter);
		}
		if (this._field) {
			if (nextField instanceof BasicField && this._field instanceof BasicField) {
				ErrorHandler.Throw(ErrorCat.invalidType);
			}
			this._field.OnDestroyed.Off(this._destroyedFieldFunc);
			((this._field as unknown) as Item).Destroy();
		}
		this._field = nextField;
		this._field.OnDestroyed.On(this._destroyedFieldFunc);
		this.GetOccupiers().forEach((oc) => {
			this._field.SetPowerUp(oc);
		});
		this.OnFieldChanged.Invoke(this, this);
		return nextField;
	}

	public HasOccupier(): boolean {
		this._occupiers = this._occupiers.filter((o) => o.IsAlive());
		return 0 < this._occupiers.length;
	}

	public HasAroundOccupier(): boolean {
		return this.HasOccupier() || this.GetNearby().filter((c) => (<Cell>c).HasOccupier()).length > 0;
	}

	public HasAllyNearby(a: Identity): boolean {
		return this.HasAlly(a) || this.GetNearby().filter((c) => (<Cell>c).HasAlly(a)).length > 0;
	}

	public AddOccupier(vehicle: Vehicle) {
		this._occupiers.push(vehicle);
	}

	public RemoveOccupier(vehicle: Vehicle) {
		this._occupiers = this._occupiers.filter((o) => o !== vehicle);
	}

	public IsBlocked(): boolean {
		return (!isNullOrUndefined(this._field) && this._field.IsBlocking()) || this.HasOccupier();
	}

	public HasBlockingField(): boolean {
		return !isNullOrUndefined(this._field) && this._field.IsBlocking();
	}

	public HasShootableField(): boolean {
		return this._field.IsDesctrutible();
	}

	public IsShootable(): boolean {
		return this._field.IsDesctrutible() || this.HasOccupier();
	}

	public GetShootableEntity(): AliveItem {
		if (this.HasOccupier()) {
			const vehicle = this._occupiers[0] as Vehicle;
			if (vehicle.GetCurrentCell() === this) {
				return vehicle;
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
		if (this.HasOccupier()) {
			return this._occupiers.some((oc) => id.GetRelation(oc.Identity) === Relationship.Ally);
		}
		if (this._field) {
			return id.GetRelation(this._field.GetIdentity()) === Relationship.Ally;
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

		this.HandleCellStateChanged(state);

		this._cellStateSprites.Get(CellState[this._state]).forEach((sprite) => {
			this.SetProperty(sprite, (e) => (e.alpha = 1));
		});

		if (isDiscovered) {
			this.SetProperty(SvgArchive.hiddenCell, (e) => (e.alpha = 1));
			this._shadowAnimator = new BouncingScaleDownAnimator(this, [ SvgArchive.hiddenCell ]);
		}
	}

	public Coo(): string {
		return this.GetHexCoo().ToString();
	}

	public Decorate(sprite: string): void {
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
		this.InitPosition(this.Properties.BoundingBox.GetPosition());
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

	public Update(): void {
		super.Update();
		this.UpdateHitbox();

		this._whiteSelection.Update();
		this._blueSelection.Update();

		if (this._shadowAnimator) {
			if (this._shadowAnimator.IsDone) {
				this._shadowAnimator = null;
			} else {
				this._shadowAnimator.Update();
			}
		}
	}

	private UpdateHitbox() {
		const smallRadius = this.GetBoundingBox().GetWidth() / 3;
		const radius = this.GetBoundingBox().GetWidth() / 4;

		this._circle.clear();
		this._circle.lineStyle(2, 0xffffff, 0);
		this._circle.drawCircle(0, 0, smallRadius);

		this._multiCircle.clear();
		this._multiCircle.lineStyle(2, 0x428af5, 0);
		this._multiCircle.drawCircle(0, 0, radius);

		this._hitbox.x = this._circle.x;
		this._hitbox.y = this._circle.y;

		this._multihitbox.x = this._multiCircle.x;
		this._multihitbox.y = this._multiCircle.y;
	}

	public Select(context: IInteractionContext): boolean {
		var isSelected =
			context instanceof MultiSelectionContext
				? this._multihitbox.contains(context.Point.x, context.Point.y)
				: this._hitbox.contains(context.Point.x, context.Point.y);
		if (isSelected) {
			StaticLogger.Log(LogKind.info, `Q:${this.GetHexCoo().Q} R:${this.GetHexCoo().R}`);
			context.OnSelect(this);
		}
		return false;
	}
}
