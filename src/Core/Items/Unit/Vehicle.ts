import { Identity } from './../Identity';
import { BasicItem } from './../BasicItem';
import { ZKind } from './../ZKind';
import { UiOrder } from './../../Ia/Order/UiOrder';
import { IOrder } from './../../Ia/Order/IOrder';
import { Cell } from './../Cell/Cell';
import { GameSettings } from './../../Framework/GameSettings';
import { CellStateSetter } from '../Cell/CellStateSetter';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
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
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { CellState } from '../Cell/CellState';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { CellProperties } from '../Cell/CellProperties';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { Sprite } from 'pixi.js';
import { Point } from '../../../Utils/Geometry/Point';
import { ICancellable } from './ICancellable';
import { Up } from './PowerUp/Up';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { InfiniteFadeAnimation } from '../Animator/InfiniteFadeAnimation';
import { Crater } from '../Environment/Crater';
import { TimeTimer } from '../../../Utils/Timer/TimeTimer';
import { ShieldField } from '../Cell/Field/Bonus/ShieldField';
import { CamouflageHandler } from './CamouflageHandler';
import { Explosion } from './Explosion';
import { ICamouflageAble } from './ICamouflageAble';
import { UpCalculator } from '../Cell/Field/Bonus/UpCalculator';
import { FireUp } from './PowerUp/FireUp';
import { SpeedUp } from './PowerUp/SpeedUp';
// import { TypeTranslator } from '../Cell/Field/TypeTranslator';

export abstract class Vehicle extends AliveItem
	implements IMovable, IRotatable, ISelectable, ICancellable, ICamouflageAble {
	public Id: string;
	public IsPacific: boolean = false;
	protected RootSprites: Array<string>;
	private WheelIndex: number;
	public OnCamouflageChanged: LiteEvent<AliveItem> = new LiteEvent<AliveItem>();

	public HasCamouflage: boolean;
	public Camouflage: BasicItem;
	public camouflagedSprites: Sprite[];

	//movable
	public CurrentRadius: number;
	public GoalRadius: number;
	private _nextCell: Cell;
	private _currentCell: Cell;
	private _currentOrder: IOrder = null;
	protected BoundingBox: BoundingBox;

	//stats
	private _upCalculator: UpCalculator = new UpCalculator();

	private _translationMaker: ITranslationMaker;
	private _rotationMaker: IRotationMaker;
	private _angleFinder: IAngleFinder;
	private _nextOrder: IOrder;
	private _uiOrder: UiOrder = new UiOrder(this);

	private _dustTimer: TimeTimer;
	private _dustIndex: number;
	private _leftDusts: Array<Dust>;
	private _rightDusts: Array<Dust>;

	private _ups: Array<Up> = [];
	private _upAngle: number = 0;

	private _handleCellStateChanged: any = this.HandleCellStateChanged.bind(this);
	public OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	public OnCellChanged: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnNextCellChanged: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnOrdering: LiteEvent<Cell[]> = new LiteEvent<Cell[]>();
	public OnOrdered: LiteEvent<Cell[]> = new LiteEvent<Cell[]>();
	public OnPathFound: LiteEvent<Cell[]> = new LiteEvent<Cell[]>();
	public OnOrderCanceled: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();
	public OnTranslateStarted: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnTranslateStopped: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnPowerUp: LiteEvent<Up> = new LiteEvent<Up>();
	public OnPowerDown: LiteEvent<Up> = new LiteEvent<Up>();

	private _infiniteAnimator: InfiniteFadeAnimation;

	constructor(identity: Identity) {
		super();
		this.Identity = identity;
		this.CurrentRadius = 0;
		this.BoundingBox = new BoundingBox();

		this.GenerateSprite(SvgArchive.selectionUnit);
		this.SetProperties([ SvgArchive.selectionUnit ], (sprite) => (sprite.alpha = 0));

		this.Z = ZKind.Cell;
		this.BoundingBox.Width = CellProperties.GetWidth(GameSettings.Size);
		this.BoundingBox.Height = CellProperties.GetHeight(GameSettings.Size);
		this.RootSprites = new Array<string>();

		this.GenerateSprite(SvgArchive.wheel);
		this.RootSprites.push(SvgArchive.wheel);

		SvgArchive.wheels.forEach((wheel) => {
			this.GenerateSprite(wheel, (s) => (s.alpha = 0));
			this.RootSprites.push(wheel);
		});

		if (this.Identity.IsPlayer) {
			this.GenerateSprite(SvgArchive.selectionBlueVehicle);
			this._infiniteAnimator = new InfiniteFadeAnimation(this, SvgArchive.selectionBlueVehicle, 0, 1, 0.1);
			this.RootSprites.push(SvgArchive.selectionBlueVehicle);
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
		this.SetProperty(SvgArchive.wheels[0], (s) => (s.alpha = 1));
	}

	public GetCurrentOrder(): IOrder {
		return this._currentOrder;
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
		let translationDuration = GameSettings.TranslatinDuration;
		this._ups.filter((up) => up instanceof SpeedUp).forEach((up) => {
			translationDuration += this._upCalculator.GetTranslationUp(up.GetCurrentEnergy());
		});

		if (translationDuration < GameSettings.GetFastestTranslation()) {
			return GameSettings.GetFastestTranslation();
		}
		return translationDuration;
	}
	public GetRotatingDuration(): number {
		let rotationDuration = GameSettings.RotatingDuration;
		this._ups.filter((up) => up instanceof SpeedUp).forEach((up) => {
			rotationDuration += this._upCalculator.GetRotationUp(up.GetCurrentEnergy());
		});

		if (rotationDuration < GameSettings.GetFastestRotation()) {
			return GameSettings.GetFastestRotation();
		}
		return rotationDuration;
	}

	public GetFire(): number {
		let fire = GameSettings.Fire;
		this._ups.filter((up) => up instanceof FireUp).forEach((up) => {
			fire += this._upCalculator.GetAttack(up.GetCurrentEnergy());
		});
		return fire;
	}

	public AddPowerUp(up: Up): void {
		this._ups.push(up);
		this.OnPowerUp.Invoke(this, up);
		this._translationMaker.Update();
		this._rotationMaker.Update();
		if (up.HasAnimation) {
			this._upAngle += Math.PI * 2 * 60 / 360;
		}
	}

	public DeletePowerUp(up: Up): void {
		this._ups = this._ups.filter((u) => up !== u);
		this.OnPowerDown.Invoke(this, up);
		this._translationMaker.Update();
		this._rotationMaker.Update();
		if (up.HasAnimation) {
			this._upAngle -= Math.PI * 2 * 60 / 360;
		}
	}

	public GetUpAngle(): number {
		return this._upAngle;
	}

	public GiveOrder(order: IOrder): void {
		this.OnOrdering.Invoke(this, order.GetPath());

		this.RemoveCamouflage();
		this._nextOrder = order;

		this.CancelOrder();
	}

	GetCurrentPath(): Cell[] {
		return this._currentOrder.GetPath();
	}

	public SetDamage(damage: number): void {
		damage = +damage.toFixed(2);
		const field = this._currentCell.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			shield.SetDamage(damage);
		} else {
			this.Life -= damage;
			this.UpdateDamage();
		}
		this.OnDamageReceived.Invoke(this, damage);
	}

	public CancelOrder(): void {
		if (this._currentOrder) {
			this._currentOrder.Cancel();
			this.OnOrderCanceled.Invoke(this, this);
		}
	}

	//only online
	public ResetCell(cell: Cell, nextCell: Cell = undefined): void {
		if (this._currentCell && this._currentCell.GetOccupiers().some((o) => o === this)) {
			this._currentCell.RemoveOccupier(this);
		}
		this._currentCell = cell;
		this._currentCell.AddOccupier(this);
		this.InitCell(this._currentCell.GetBoundingBox());
		if (nextCell) {
			if (this._nextCell) {
				this._nextCell.RemoveOccupier(this);
			}
			this._nextCell = nextCell;
			this._nextCell.AddOccupier(this);
		}
		this._translationMaker.Reset();
	}

	public HasOrder(): boolean {
		if (isNullOrUndefined(this._currentOrder)) {
			return false;
		}
		return !this._currentOrder.IsDone();
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
		var previousWheel = SvgArchive.wheels[this.WheelIndex];

		this.WheelIndex = (this.WheelIndex + 1) % SvgArchive.wheels.length;

		this.SetProperty(SvgArchive.wheels[this.WheelIndex], (e) => (e.alpha = 1));
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
		return this.GetCurrentSprites().Get(SvgArchive.selectionUnit).alpha === 1;
	}

	//is it the right place???
	public SetSelected(isSelected: boolean): void {
		this.SetProperty(SvgArchive.selectionUnit, (e) => (e.alpha = isSelected ? 1 : 0));
		this.UpdateUiOrder();
		this.OnSelectionChanged.Invoke(this, this);
	}

	private UpdateUiOrder() {
		if (
			this.Identity.IsPlayer &&
			this.IsSelected() &&
			this.HasOrder() &&
			!this._uiOrder.HasOrder(this._currentOrder)
		) {
			this._uiOrder.AddOrder(this._currentOrder);
		}
	}

	public GetNextCell(): Cell {
		return this._nextCell;
	}

	protected abstract HandleCellStateChanged(obj: any, cellState: CellState): void;

	public GoNextCell(): void {
		let formerCell = this._currentCell;
		this._currentCell.OnCellStateChanged.Off(this._handleCellStateChanged);

		if (formerCell.GetOccupiers().some((o) => o === this)) {
			formerCell.RemoveOccupier(this);
			formerCell.OnVehicleChanged.Invoke(this, null);
		}

		this._currentCell = this._nextCell;

		this.OnCellChanged.Invoke(this, formerCell);
		this.HandleCellStateChanged(this, this._currentCell.GetState());
		this._currentCell.OnCellStateChanged.On(this._handleCellStateChanged);
		this._nextCell = null;

		if (this._currentCell.GetField().constructor !== formerCell.GetField().constructor) {
			this._currentCell.GetField().SetPowerUp(this);
		}

		CellStateSetter.SetStates(formerCell.GetAll());
		CellStateSetter.SetStates(this._currentCell.GetAll());
		this._currentCell.UnloadCell();
	}

	public Destroy(): void {
		this.OnDestroyed.Invoke(this, this);
		this.OnDestroyed.Clear();
		this.CancelOrder();
		if (this._nextOrder) {
			this._nextOrder.Cancel();
		}
		super.Destroy();
		this._currentCell.RemoveOccupier(this);
		if (!isNullOrUndefined(this._nextCell)) {
			this._nextCell.RemoveOccupier(this);
		}
		this.IsUpdatable = false;
		this._leftDusts.forEach((ld) => ld.Destroy());
		this._rightDusts.forEach((ld) => ld.Destroy());
		this._leftDusts = [];
		this._rightDusts = [];
		CellStateSetter.SetStates(this._currentCell.GetAll());
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsAlive()) {
			this.Destroy();
			new Crater(this.BoundingBox);
			return;
		}

		if (this._infiniteAnimator) {
			this._infiniteAnimator.Update(viewX, viewY);
		}

		if (!isNullOrUndefined(this._ups)) {
			this._ups.forEach((up) => {
				up.Update(viewX, viewY);
			});
		}

		this.SetCurrentOrder();
		if (this.HasOrder()) {
			this._currentOrder.Update();
		}

		this._currentCell.GetField().Support(this);

		if (this.HasNextCell()) {
			this.Moving();
		}

		super.Update(viewX, viewY);
	}

	private SetCurrentOrder() {
		if (!this.HasOrder() && !this.HasNextCell() && this._nextOrder) {
			if (this._currentOrder) {
				this._currentOrder.Clear();
			}

			this._currentOrder = this._nextOrder;
			this._nextOrder = null;

			this.OnOrdered.Invoke(this, this._currentOrder.GetPath());
			this._currentOrder.OnPathFound.On((src: any, cells: Cell[]) => {
				this.OnPathFound.Invoke(this, cells);
			});

			this.UpdateUiOrder();
		}
	}

	public HasCurrentOrder(): boolean {
		return !isNullOrUndefined(this._currentOrder) && !this._currentOrder.IsDone();
	}

	public IsCurrentOrderEqualed(order: IOrder): boolean {
		return this._currentOrder === order;
	}

	public IsNextOrderEqualed(order: IOrder): boolean {
		return this._nextOrder === order;
	}

	public HasNextOrder(): boolean {
		return !isNullOrUndefined(this._nextOrder);
	}

	public SetPosition(cell: Cell): void {
		if (this._currentCell) {
			this._currentCell.RemoveOccupier(this);
		}
		this.InitPosition(cell.GetBoundingBox());
		this._currentCell = cell;
		this._currentCell.AddOccupier(this);
		if (!this.IsPacific) {
			this._currentCell.OnCellStateChanged.On(this._handleCellStateChanged);
			this._handleCellStateChanged(this, this._currentCell.GetState());
			CellStateSetter.SetStates(this._currentCell.GetAll());
			this._currentCell.OnVehicleChanged.Invoke(this, this);
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
			if (this._nextCell.GetOccupiers().some((o) => o === this)) {
				this._nextCell.RemoveOccupier(this);
			}
		}
		this._nextCell = cell;
		this.OnNextCellChanged.Invoke(this, this._nextCell);
		this._nextCell.AddOccupier(this);
		this._nextCell.OnVehicleChanged.Invoke(this, this);
		this._angleFinder.SetAngle(this._nextCell);
	}
	public GetCurrentCell(): Cell {
		return this._currentCell;
	}
	SetCamouflage(): boolean {
		if (this.HasNextCell()) {
			return false;
		}
		this.OnCamouflageChanged.Invoke(this, this);
		this.HasCamouflage = true;
		this.camouflagedSprites = this.GetSprites().filter((s) => s.alpha !== 0);

		if (this.Identity.IsPlayer) {
			this.camouflagedSprites.forEach((s) => {
				s.alpha = 0.5;
			});
		} else {
			this.camouflagedSprites.forEach((s) => {
				s.alpha = 0;
			});
		}

		this.Camouflage = new BasicItem(
			BoundingBox.NewFromBox(this.GetBoundingBox()),
			new CamouflageHandler().GetCamouflage(),
			ZKind.Sky
		);
		this.Camouflage.SetVisible(() => {
			return this.IsAlive() && this.HasCamouflage;
		});
		this.Camouflage.SetAlive(() => this.IsAlive() && this.HasCamouflage);

		new Explosion(
			BoundingBox.NewFromBox(this.GetBoundingBox()),
			SvgArchive.constructionEffects,
			ZKind.Sky,
			false,
			5
		);

		return true;
	}

	RemoveCamouflage() {
		if (this.HasCamouflage) {
			this.HasCamouflage = false;

			if (this.Identity.IsPlayer) {
				this.camouflagedSprites.forEach((s) => {
					s.alpha = 1;
				});
			} else {
				if (this.GetCurrentCell().GetState() === CellState.Visible) {
					this.camouflagedSprites.forEach((s) => {
						s.alpha = 1;
					});
				} else {
					this.camouflagedSprites.forEach((s) => {
						s.alpha = 0;
					});
				}
			}
			this.camouflagedSprites = [];
		}
	}
}
