import { GameSettings } from './../../Framework/GameSettings';
import { GameContext } from './../../Framework/GameContext';
import { CellStateSetter } from '../Cell/CellStateSetter';
import { BasicItem } from '../BasicItem';
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
import { isNullOrUndefined } from 'util';
import { ISelectable } from '../../ISelectable';
import { Cell } from '../Cell/Cell';
import { IOrder } from '../../Ia/Order/IOrder';
import { BoundingBox } from '../../Utils/Geometry/BoundingBox';
import { TickTimer } from '../../Utils/Timer/TickTimer';
import { CellState } from '../Cell/CellState';
import { Archive } from '../../Framework/ResourceArchiver';
import { CellProperties } from '../Cell/CellProperties';
import { Crater } from '../Environment/Crater';
import { InteractionContext } from '../../Interaction/InteractionContext';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { Explosion } from './Explosion';
import { Sprite } from 'pixi.js';
import { Point } from '../../Utils/Geometry/Point';

export abstract class Vehicle extends AliveItem implements IMovable, IRotatable, ISelectable {
	public Id: string;
	RotationSpeed: number = 0.05;
	TranslationSpeed: number = 0.2;
	Attack: number = 10;
	protected RootSprites: Array<string>;
	protected Wheels: Array<string>;
	private WheelIndex: number;

	public HasCamouflage: boolean;
	public Camouflage: BasicItem;
	public camouflagedSprites: Sprite[];

	//movable
	CurrentRadius: number;
	GoalRadius: number;
	private _nextCell: Cell;
	private _currentCell: Cell;

	private _order: IOrder;

	protected BoundingBox: BoundingBox;
	private Size: number;

	private _translationMaker: ITranslationMaker;
	private _rotationMaker: IRotationMaker;
	private _angleFinder: IAngleFinder;
	private _pendingOrder: IOrder;

	private _dustTimer: TickTimer;
	private _dustIndex: number;
	private _leftDusts: Array<Dust>;
	private _rightDusts: Array<Dust>;

	public SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	private _onCellStateChanged: { (obj: any, cellState: CellState): void };
	public CellChanged: LiteEvent<Cell> = new LiteEvent<Cell>();
	public Destoyed: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();

	constructor(public Hq: Headquarter, protected GameContext: GameContext) {
		super();
		this.CurrentRadius = 0;
		this.BoundingBox = new BoundingBox();

		this.GenerateSprite(Archive.selectionUnit);
		this.GetBothSprites(Archive.selectionUnit).forEach((sprite) => (sprite.alpha = 0));

		this.Z = 2;
		this.Size = GameSettings.Size;
		this.BoundingBox.Width = CellProperties.GetWidth(this.Size);
		this.BoundingBox.Height = CellProperties.GetHeight(this.Size);
		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this.RootSprites = new Array<string>();

		this.Wheels = new Array<string>();
		this.WheelIndex = 0;
		this._dustTimer = new TickTimer(12);
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
		this.CellChanged = new LiteEvent<Cell>();
		this.Hq.AddVehicle(this);
	}

	protected abstract RemoveCamouflage(): void;

	public SetOrder(order: IOrder): void {
		this.RemoveCamouflage();
		this._pendingOrder = order;

		if (!isNullOrUndefined(this._order)) {
			this._order.Cancel();
		}
	}

	public CancelOrder(): void {
		if (this._order) {
			this._order.Cancel();
		}
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
			this.SetRotation();
		} else {
			if (this.GetNextCell().GetState() === CellState.Visible) {
				this.OnCellStateChanged(this, this.GetNextCell().GetState());
			}
			this._translationMaker.Translate();
		}
		this.HandleMovingEffect();
	}

	private SetRotation(): void {
		this.RootSprites.forEach((sprite) => {
			this.GetBothSprites(sprite).forEach((sp) => (sp.rotation = this.CurrentRadius));
		});
	}

	private HandleMovingEffect(): void {
		this.HandleWheels();
		this.HandleDust();
	}

	private HandleWheels(): void {
		var previousWheel = this.Wheels[this.WheelIndex];

		this.WheelIndex = (this.WheelIndex + 1) % this.Wheels.length;

		this.SetProperty(this.Wheels[this.WheelIndex], (e) => (e.alpha = 1));
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
		return this.GetCurrentSprites()[Archive.selectionUnit].alpha === 1;
	}

	public SetSelected(isSelected: boolean): void {
		this.SetProperty(Archive.selectionUnit, (e) => (e.alpha = isSelected ? 1 : 0));
		this.SelectionChanged.Invoke(this, this);
	}

	public GetNextCell(): Cell {
		return this._nextCell;
	}

	protected abstract OnCellStateChanged(obj: any, cellState: CellState): void;

	public MoveNextCell(): void {
		let previouscell = this._currentCell;
		this._currentCell.CellStateChanged.Off(this._onCellStateChanged);

		this._currentCell = this._nextCell;
		this.CellChanged.Invoke(this._currentCell);
		this.OnCellStateChanged(this, this._currentCell.GetState());
		this._currentCell.CellStateChanged.On(this._onCellStateChanged);
		this._nextCell = null;

		CellStateSetter.SetStates(this.GameContext, previouscell.GetAll());
		CellStateSetter.SetStates(this.GameContext, this._currentCell.GetAll());
	}

	public Destroy(): void {
		this.Destoyed.Invoke(this, this);
		this.Destoyed.Clear();
		PeerHandler.SendMessage(PacketKind.Destroyed, {
			cell: this._currentCell.GetCoordinate(),
			Name: 'vehicle'
		});
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
		if (!this.IsAlive() || !this.Hq.IsAlive()) {
			if (!this.Hq.IsAlive()) {
				new Explosion(this.GetBoundingBox(), Archive.explosions, 5, true, 20);
			}
			this.Destroy();
			new Crater(this.BoundingBox);

			return;
		}

		if (this.ExistsOrder() && !this._order.IsDone()) {
			this._order.Do();
		}

		if (!this.ExistsOrder() || (this._order.IsDone() && !this.HasNextCell())) {
			if (this._pendingOrder) {
				this._order = this._pendingOrder;
				this._pendingOrder = null;
				this._order.Do();
			}
		}

		this._currentCell.GetField().Support(this);

		if (this.HasNextCell()) {
			this.Moving();
			this.SetCurrentCellEmpty();
		} else {
			if (this._pendingOrder) {
				this._order = this._pendingOrder;
				this._pendingOrder = null;
			}
		}

		super.Update(viewX, viewY);
	}

	private SetCurrentCellEmpty() {
		if (this._currentCell.GetOccupier() === this && this._nextCell) {
			const currentcellDistance = Math.sqrt(
				Math.pow(this._currentCell.GetBoundingBox().X - this.GetBoundingBox().X, 2) +
					Math.pow(this._currentCell.GetBoundingBox().Y - this.GetBoundingBox().Y, 2)
			);
			const nextcellDistance = Math.sqrt(
				Math.pow(this.GetBoundingBox().X - this._nextCell.GetBoundingBox().X, 2) +
					Math.pow(this.GetBoundingBox().Y - this._nextCell.GetBoundingBox().Y, 2)
			);

			if (nextcellDistance < currentcellDistance) {
				this._currentCell.SetOccupier(null);
			}
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
		this._currentCell.CellStateChanged.On(this._onCellStateChanged);
		this._onCellStateChanged(this, this._currentCell.GetState());
		CellStateSetter.SetStates(this.GameContext, this._currentCell.GetAll());
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
		this._nextCell.SetOccupier(this);
		this._angleFinder.SetAngle(this._nextCell);
	}
	public GetCurrentCell(): Cell {
		return this._currentCell;
	}
}
