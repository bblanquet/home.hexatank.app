import { TimeTimer } from './../../Utils/Timer/TimeTimer';
import { BasicItem } from './../BasicItem';
import { ShieldField } from './../Cell/Field/Bonus/ShieldField';
import { ZKind } from './../ZKind';
import { UiOrder } from './../../Ia/Order/UiOrder';
import { IOrder } from './../../Ia/Order/IOrder';
import { Cell } from './../Cell/Cell';
import { GameSettings } from './../../Framework/GameSettings';
import { GameContext } from './../../Framework/GameContext';
import { CellStateSetter } from '../Cell/CellStateSetter';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { Headquarter } from '../Cell/Field/Hq/Headquarter';
import { Dust } from './Dust';
import { AliveItem } from '../AliveItem';
import { ITranslationMaker } from './MotionHelpers/ITranslationMaker';
import { IMovable } from '../IMovable';
import { IRotationMaker } from './MotionHelpers/IRotationMaker';
import { IAngleFinder } from './MotionHelpers/IAngleFinder';
import { TranslationMaker } from './MotionHelpers/TranslationMaker';
import { RotationMaker } from './MotionHelpers/RotationMaker';
import { AngleFinder } from './MotionHelpers/AngleFinder';
import { IRotatable } from './MotionHelpers/IRotatable';
import { ISelectable } from '../../ISelectable';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { CellState } from '../Cell/CellState';
import { Archive } from '../../Framework/ResourceArchiver';
import { CellProperties } from '../Cell/CellProperties';
import { Crater } from '../Environment/Crater';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { Explosion } from './Explosion';
import { Sprite } from 'pixi.js';
import { Point } from '../../Utils/Geometry/Point';
import { ICancellable } from './ICancellable';
import { Up } from './PowerUp/Up';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { InfiniteFadeAnimation } from '../Animator/InfiniteFadeAnimation';

export abstract class Vehicle extends AliveItem implements IMovable, IRotatable, ISelectable, ICancellable {
	public PowerUps: Array<Up> = [];
	public Id: string;
	private _rotatingDuration: number = GameSettings.RotatingDuration;
	private _translatingDuration: number = GameSettings.TranslatinDuration;
	public Attack: number = 10;
	public IsPacific: boolean = false;
	protected RootSprites: Array<string>;
	private WheelIndex: number;

	public HasCamouflage: boolean;
	public Camouflage: BasicItem;
	public camouflagedSprites: Sprite[];

	//movable
	public CurrentRadius: number;
	public GoalRadius: number;
	private _nextCell: Cell;
	private _currentCell: Cell;

	private _order: IOrder = null;

	protected BoundingBox: BoundingBox;
	private Size: number;

	private _translationMaker: ITranslationMaker;
	private _rotationMaker: IRotationMaker;
	private _angleFinder: IAngleFinder;
	private _pendingOrder: IOrder;

	private _dustTimer: TimeTimer;
	private _dustIndex: number;
	private _leftDusts: Array<Dust>;
	private _rightDusts: Array<Dust>;

	private _handleCellStateChanged: (obj: any, cellState: CellState) => void;
	public OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	public OnCellChanged: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnNextCellChanged: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnOrderChanging: LiteEvent<IOrder> = new LiteEvent<IOrder>();
	public OnOrderStopped: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();
	public OnTranslateStarted: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnTranslateStopped: LiteEvent<Cell> = new LiteEvent<Cell>();

	private _infiniteAnimator: InfiniteFadeAnimation;

	constructor(public Hq: Headquarter, protected GameContext: GameContext) {
		super();
		this.CurrentRadius = 0;
		this.BoundingBox = new BoundingBox();

		this.GenerateSprite(Archive.selectionUnit);
		this.SetProperties([ Archive.selectionUnit ], (sprite) => (sprite.alpha = 0));

		this.Z = ZKind.Cell;
		this.Size = GameSettings.Size;
		this.BoundingBox.Width = CellProperties.GetWidth(this.Size);
		this.BoundingBox.Height = CellProperties.GetHeight(this.Size);
		this._handleCellStateChanged = this.HandleCellStateChanged.bind(this);
		this.RootSprites = new Array<string>();

		this.GenerateSprite(Archive.wheel);
		this.RootSprites.push(Archive.wheel);

		Archive.wheels.forEach((wheel) => {
			this.GenerateSprite(wheel, (s) => (s.alpha = 0));
			this.RootSprites.push(wheel);
		});

		if (this.Hq === this.GameContext.GetMainHq()) {
			this.GenerateSprite(Archive.selectionBlueVehicle);
			this._infiniteAnimator = new InfiniteFadeAnimation(this, Archive.selectionBlueVehicle, 0, 1, 0.05);
			this.RootSprites.push(Archive.selectionBlueVehicle);
		}

		this.WheelIndex = 0;
		this._dustTimer = new TimeTimer(150);
		this._dustIndex = 0;

		this._translationMaker = new TranslationMaker<Vehicle>(this);
		this._rotationMaker = new RotationMaker<Vehicle>(this);
		this._angleFinder = new AngleFinder<Vehicle>(this);
		this._leftDusts = [
			new Dust(new BoundingBox()),
			new Dust(new BoundingBox()),
			new Dust(new BoundingBox()),
			new Dust(new BoundingBox())
		];
		this._rightDusts = [
			new Dust(new BoundingBox()),
			new Dust(new BoundingBox()),
			new Dust(new BoundingBox()),
			new Dust(new BoundingBox())
		];
		this.OnCellChanged = new LiteEvent<Cell>();
		this.Hq.AddVehicle(this);
		this.SetProperty(Archive.wheels[0], (s) => (s.alpha = 1));
	}

	public IsMainCell(cell: Cell): boolean {
		if (this.HasNextCell()) {
			if (this._translationMaker.Percentage() < 50) {
				return this.GetCurrentCell() === cell;
			} else {
				return this.GetNextCell() === cell;
			}
		} else {
			return true;
		}
	}

	public GetNextCellProgression(): number {
		return this._translationMaker.Duration();
	}

	public GetTranslationDuration(): number {
		if (this._translatingDuration < GameSettings.GetFastestTranslation()) {
			return GameSettings.GetFastestTranslation();
		}
		return this._translatingDuration;
	}
	public SetTranslationDuration(translation: number): void {
		this._translatingDuration += translation;
	}
	public GetRotatingDuration(): number {
		if (this._rotatingDuration < GameSettings.GetFastestRotation()) {
			return GameSettings.GetFastestRotation();
		}
		return this._rotatingDuration;
	}
	public SetRotatingDuration(rotation: number): void {
		this._rotatingDuration += rotation;
	}

	protected abstract RemoveCamouflage(): void;

	public SetPowerUp(up: Up) {
		if (0 < this.PowerUps.length) {
			const last = this.PowerUps[this.PowerUps.length - 1];
			up.Animation.SetCurrentRotation(last.Animation.GetCurrentRotation() + Math.PI * 2 * 60 / 360);
		}
		this.PowerUps.push(up);
	}

	public SetOrder(order: IOrder): void {
		this.OnOrderChanging.Invoke(this, order);

		this.RemoveCamouflage();
		this._pendingOrder = order;

		if (!isNullOrUndefined(this._order)) {
			this._order.Cancel();
		}
	}

	public SetDamage(damage: number): void {
		const field = this._currentCell.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			shield.SetDamage(damage);
		} else {
			this.Life -= damage;
			this.UpdateDamage();
		}
	}

	public CancelOrder(): void {
		if (this._order) {
			this._order.Cancel();
		}
	}

	public HasOrder(): boolean {
		if (isNullOrUndefined(this._order)) {
			return false;
		}
		return !this._order.IsDone();
	}

	public GetBoundingBox(): BoundingBox {
		return this.BoundingBox;
	}

	public HasNextCell(): Boolean {
		return !isNullOrUndefined(this._nextCell);
	}

	private Moving(): void {
		if (this.CurrentRadius != this.GoalRadius) {
			this._rotationMaker.Rotate();
			this.SetSpriteRotation();
		} else {
			if (this.GetNextCell().GetState() === CellState.Visible) {
				this.HandleCellStateChanged(this, this.GetNextCell().GetState());
			}
			this._translationMaker.Translate();
		}
		this.HandleMovingEffect();
	}

	private SetSpriteRotation(): void {
		this.RootSprites.forEach((sprite) => {
			this.SetProperty(sprite, (sp) => (sp.rotation = this.CurrentRadius));
		});
	}

	private HandleMovingEffect(): void {
		this.HandleWheels();
		this.HandleDust();
	}

	private HandleWheels(): void {
		var previousWheel = Archive.wheels[this.WheelIndex];

		this.WheelIndex = (this.WheelIndex + 1) % Archive.wheels.length;

		this.SetProperty(Archive.wheels[this.WheelIndex], (e) => (e.alpha = 1));
		this.SetProperty(previousWheel, (e) => (e.alpha = 0));
	}

	private HandleDust(): void {
		if (this._dustTimer.IsElapsed()) {
			const ref = this.GetBoundingBox().GetCentralPoint();
			const width = this.GetBoundingBox().Width;
			const height = this.GetBoundingBox().Height;

			const left = new BoundingBox();
			let leftPoint = new Point(0, 0);
			if (1.57 < Math.abs(this.CurrentRadius) && Math.abs(this.CurrentRadius) < 4.71) {
				leftPoint.X = ref.X + (width / 5 + width / 5);
				leftPoint.Y = ref.Y + (height / 7 + width / 5);
			} else {
				leftPoint.X = ref.X + width / 5;
				leftPoint.Y = ref.Y + height / 7;
			}

			leftPoint = this.RotatePoint(ref, this.CurrentRadius, leftPoint);

			left.SetPosition(leftPoint);
			left.Width = this.GetBoundingBox().Width / 5;
			left.Height = this.GetBoundingBox().Width / 5;

			this._leftDusts[this._dustIndex].Reset(left);
			this._leftDusts[this._dustIndex].GetSprites().forEach((s) => {
				s.visible = this._currentCell.IsVisible();
			});

			const right = new BoundingBox();
			let rightPoint = new Point(0, 0);
			if (1.57 < Math.abs(this.CurrentRadius) && Math.abs(this.CurrentRadius) < 4.71) {
				rightPoint.X = ref.X - width / 5;
				rightPoint.Y = ref.Y + (height / 7 + width / 5);
			} else {
				rightPoint.X = ref.X - (width / 5 + width / 5);
				rightPoint.Y = ref.Y + height / 7;
			}

			rightPoint = this.RotatePoint(ref, this.CurrentRadius, rightPoint);

			right.SetPosition(rightPoint);
			right.Width = this.GetBoundingBox().Width / 5;
			right.Height = this.GetBoundingBox().Width / 5;

			this._rightDusts[this._dustIndex].Reset(right);
			this._rightDusts[this._dustIndex].GetSprites().forEach((s) => {
				s.visible = this._currentCell.IsVisible();
			});

			this._dustIndex = (this._dustIndex + 1) % this._leftDusts.length;
		}
	}

	private RotatePoint(ref: Point, angle: number, orginal: Point): Point {
		// translate point back to origin:
		orginal.X -= ref.X;
		orginal.Y -= ref.Y;

		// rotate point
		const xnew = orginal.X * Math.cos(angle) - orginal.Y * Math.sin(angle);
		const ynew = orginal.X * Math.sin(angle) + orginal.Y * Math.cos(angle);

		// translate point back:
		orginal.X = xnew + ref.X;
		orginal.Y = ynew + ref.Y;
		return orginal;
	}

	public IsSelected(): boolean {
		return this.GetCurrentSprites().Get(Archive.selectionUnit).alpha === 1;
	}

	//is it the right place???
	private _uiOrder: UiOrder;
	public SetSelected(isSelected: boolean): void {
		this.SetProperty(Archive.selectionUnit, (e) => (e.alpha = isSelected ? 1 : 0));
		this.SetUiOrder();
		this.OnSelectionChanged.Invoke(this, this);
	}

	private SetUiOrder() {
		if (!this.GameContext.GetMainHq().IsEnemy(this)) {
			if (this._uiOrder && this.HasOrder() && this._uiOrder.HasOrder(this._order) && this.IsSelected()) {
				return;
			}

			if (this._uiOrder) {
				this._uiOrder.Clear();
				this._uiOrder = null;
			}
			if (this.IsSelected() && this.HasOrder()) {
				this._uiOrder = new UiOrder(this._order);
			}
		}
	}

	public GetNextCell(): Cell {
		return this._nextCell;
	}

	protected abstract HandleCellStateChanged(obj: any, cellState: CellState): void;

	public MoveNextCell(): void {
		let previouscell = this._currentCell;
		this._currentCell.OnCellStateChanged.Off(this._handleCellStateChanged);

		if (previouscell.GetOccupier() === this) {
			previouscell.SetOccupier(null);
		}

		this._currentCell = this._nextCell;

		this.OnCellChanged.Invoke(this, previouscell);
		this.HandleCellStateChanged(this, this._currentCell.GetState());
		this._currentCell.OnCellStateChanged.On(this._handleCellStateChanged);
		this._nextCell = null;

		if (!this.HasOrder()) {
			this.OnOrderStopped.Invoke(this, this);
		}

		if (this._currentCell.GetField().constructor !== previouscell.GetField().constructor) {
			this._currentCell.GetField().SetPowerUp(this);
		}

		CellStateSetter.SetStates(this.GameContext, previouscell.GetAll());
		CellStateSetter.SetStates(this.GameContext, this._currentCell.GetAll());
	}

	public Destroy(): void {
		this.OnDestroyed.Invoke(this, this);
		this.OnDestroyed.Clear();
		if (this._order) {
			this._order.Cancel();
		}
		if (this._pendingOrder) {
			this._pendingOrder.Cancel();
		}
		super.Destroy();
		this._currentCell.SetOccupier(null);
		if (!isNullOrUndefined(this._nextCell)) {
			this._nextCell.SetOccupier(null);
		}
		this.IsUpdatable = false;
		this._leftDusts.forEach((ld) => ld.Destroy());
		this._rightDusts.forEach((ld) => ld.Destroy());
		this._leftDusts = [];
		this._rightDusts = [];
		CellStateSetter.SetStates(this.GameContext, this._currentCell.GetAll());
	}

	public Update(viewX: number, viewY: number): void {
		if (this._infiniteAnimator) {
			this._infiniteAnimator.Update(viewX, viewY);
		}

		if (!isNullOrUndefined(this.PowerUps)) {
			this.PowerUps.forEach((powerUp) => {
				powerUp.Animation.Update(viewX, viewY);
			});
		}

		if (!this.IsAlive() || !this.Hq.IsAlive()) {
			if (!this.Hq.IsAlive()) {
				new Explosion(this.GetBoundingBox(), Archive.explosions, ZKind.Sky, true, 20);
			}
			this.Destroy();
			new Crater(this.BoundingBox);

			return;
		}

		this.Switch();
		if (this.HasOrder()) {
			this._order.Do();
		}

		this._currentCell.GetField().Support(this);

		if (this.HasNextCell()) {
			this.Moving();
		}

		super.Update(viewX, viewY);
	}

	private Switch() {
		if (!this.HasOrder() && !this.HasNextCell() && this._pendingOrder) {
			this._order = this._pendingOrder;
			this._pendingOrder = null;
			this.SetUiOrder();
		}
	}

	public ExistsOrder(): boolean {
		return !isNullOrUndefined(this._order);
	}

	public IsExecutingOrder(): boolean {
		return !isNullOrUndefined(this._order) && !this._order.IsDone();
	}

	public HasPendingOrder(): boolean {
		return !isNullOrUndefined(this._pendingOrder);
	}

	public SetPosition(cell: Cell): void {
		this.InitPosition(cell.GetBoundingBox());
		this._currentCell = cell;
		this._currentCell.SetOccupier(this);
		if (!this.IsPacific) {
			this._currentCell.OnCellStateChanged.On(this._handleCellStateChanged);
			this._handleCellStateChanged(this, this._currentCell.GetState());
			CellStateSetter.SetStates(this.GameContext, this._currentCell.GetAll());
			this._currentCell.OnUnitChanged.Invoke(this, this);
		}
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public SetNextCell(cell: Cell): void {
		if (this.HasCamouflage) {
			this.RemoveCamouflage();
		}
		if (this._nextCell) {
			if (this._nextCell.GetOccupier() === this) {
				this._nextCell.SetOccupier(null);
			}
		}
		this._nextCell = cell;
		this.OnNextCellChanged.Invoke(this, this._nextCell);
		this._nextCell.SetOccupier(this);
		this._nextCell.OnUnitChanged.Invoke(this, this);
		this._angleFinder.SetAngle(this._nextCell);
	}
	public GetCurrentCell(): Cell {
		return this._currentCell;
	}
}
