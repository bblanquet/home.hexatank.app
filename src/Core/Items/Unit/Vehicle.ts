import { CellStateSetter } from './../../Cell/CellStateSetter';
import { GameSettings } from './../../Utils/GameSettings';
import { BasicItem } from '../BasicItem';
import { LiteEvent } from '../../Utils/LiteEvent';
import { Headquarter } from '../../Cell/Field/Headquarter';
import { Dust } from './Dust';
import { AliveItem } from '../AliveItem';
import { ITranslationMaker } from './Utils/ITranslationMaker';
import { IMovable } from '../IMovable';
import { IRotationMaker } from './Utils/IRotationMaker';
import { IAngleFinder } from './Utils/IAngleFinder';
import { TranslationMaker } from './Utils/TranslationMaker';
import { RotationMaker } from './Utils/RotationMaker';
import { AngleFinder } from './Utils/AngleFinder';
import { IRotatable } from './Utils/IRotatable';
import { isNullOrUndefined } from 'util';
import { ISelectable } from '../../ISelectable';
import { Cell } from '../../Cell/Cell';
import { IOrder } from '../../Ia/Order/IOrder';
import { BoundingBox } from '../../Utils/BoundingBox';
import { Timer } from '../../Utils/Timer';
import { CellState } from '../../Cell/CellState';
import { Archive } from '../../Utils/ResourceArchiver';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { CellProperties } from '../../Cell/CellProperties';
import { Crater } from '../Others/Crater';
import { InteractionContext } from '../../Context/InteractionContext';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { Explosion } from './Explosion';
import { Sprite } from 'pixi.js';

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

	private _dustTimer: Timer;
	private _dustIndex: number;
	private _leftDusts: Array<Dust>;
	private _rightDusts: Array<Dust>;

	public SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	private _onCellStateChanged: { (obj: any, cellState: CellState): void };
	public CellChanged: LiteEvent<Cell> = new LiteEvent<Cell>();
	public Destoyed: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();

	constructor(public Hq: Headquarter) {
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
		this._dustTimer = new Timer(12);
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
		this._leftDusts.forEach((ld) => PlaygroundHelper.Playground.Items.push(ld));
		this._rightDusts.forEach((rd) => PlaygroundHelper.Playground.Items.push(rd));
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
			let center = this.GetBoundingBox().GetCenter();
			let middle = this.GetBoundingBox().GetMiddle();
			let width = this.GetBoundingBox().Width;
			let height = this.GetBoundingBox().Height;

			const leftb = new BoundingBox();
			leftb.X = center + (width / 3 - this.GetBoundingBox().Width / 5) * Math.cos(this.CurrentRadius);
			leftb.Y = middle + (height / 3 - this.GetBoundingBox().Width / 5) * Math.sin(this.CurrentRadius);
			leftb.Width = this.GetBoundingBox().Width / 5;
			leftb.Height = this.GetBoundingBox().Width / 5;

			this._leftDusts[this._dustIndex].Reset(leftb);
			this._leftDusts[this._dustIndex].GetSprites().forEach((s) => {
				s.visible = this._currentCell.IsVisible();
			});

			const rightb = new BoundingBox();
			rightb.X = center + width / 3 * Math.sin(this.CurrentRadius);
			rightb.Y = middle + height / 3 * Math.cos(this.CurrentRadius);
			rightb.Width = this.GetBoundingBox().Width / 5;
			rightb.Height = this.GetBoundingBox().Width / 5;

			this._rightDusts[this._dustIndex].Reset(rightb);
			this._rightDusts[this._dustIndex].GetSprites().forEach((s) => {
				s.visible = this._currentCell.IsVisible();
			});

			console.log(this.CurrentRadius);

			this._dustIndex = (this._dustIndex + 1) % this._leftDusts.length;
		}
	}

	public IsSelected(): boolean {
		return this.GetCurrentSprites()[Archive.selectionUnit].alpha === 1;
	}

	public SetSelected(isSelected: boolean): void {
		this.SetProperty(Archive.selectionUnit, (e) => (e.alpha = isSelected ? 1 : 0));
		this.SelectionChanged.trigger(this, this);
	}

	public GetNextCell(): Cell {
		return this._nextCell;
	}

	protected abstract OnCellStateChanged(obj: any, cellState: CellState): void;

	public MoveNextCell(): void {
		let previouscell = this._currentCell;
		this._currentCell.CellStateChanged.off(this._onCellStateChanged);

		this._currentCell = this._nextCell;
		this.CellChanged.trigger(this._currentCell);
		this.OnCellStateChanged(this, this._currentCell.GetState());
		this._currentCell.CellStateChanged.on(this._onCellStateChanged);
		this._nextCell = null;

		CellStateSetter.SetStates(previouscell.GetAll());
		CellStateSetter.SetStates(this._currentCell.GetAll());
	}

	public Destroy(): void {
		this.Destoyed.trigger(this, this);
		this.Destoyed.clear();
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
		PlaygroundHelper.Render.Remove(this);
		this.IsUpdatable = false;
		this._leftDusts.forEach((ld) => ld.Destroy());
		this._rightDusts.forEach((ld) => ld.Destroy());
		this._leftDusts = [];
		this._rightDusts = [];
		CellStateSetter.SetStates(this._currentCell.GetAll());
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsAlive() || !this.Hq.IsAlive()) {
			if (!this.Hq.IsAlive()) {
				let explosion = new Explosion(this.GetBoundingBox(), Archive.explosions, 5, true, 20);
				PlaygroundHelper.Playground.Items.push(explosion);
			}
			this.Destroy();
			let crater = new Crater(this.BoundingBox);
			PlaygroundHelper.Playground.Items.push(crater);
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
		this._currentCell.CellStateChanged.on(this._onCellStateChanged);
		this._onCellStateChanged(this, this._currentCell.GetState());
		CellStateSetter.SetStates(this._currentCell.GetAll());
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
