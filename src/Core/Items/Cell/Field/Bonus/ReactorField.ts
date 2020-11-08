import { ZKind } from './../../../ZKind';
import { BatteryField } from './BatteryField';
import { TypeTranslator } from '../TypeTranslator';
import { BasicRangeAnimator } from '../../../Animator/BasicRangeAnimator';
import { GameContext } from '../../../../Framework/GameContext';
import { ReactorAppearance } from './ReactorAppearance';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { CellStateSetter } from '../../CellStateSetter';
import { Battery } from '../Battery';
import { BasicItem } from '../../../BasicItem';
import { ISelectable } from '../../../../ISelectable';
import { Headquarter } from '../Hq/Headquarter';
import { Field } from '../Field';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Vehicle } from '../../../Unit/Vehicle';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { Cell } from '../../Cell';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { CellContext } from '../../CellContext';
import { AttackMenuItem } from '../../../../Menu/Buttons/AttackMenuItem';
import { Tank } from '../../../Unit/Tank';
import { AttackUp } from '../../../Unit/PowerUp/AttackUp';
import { TimeUpCondition } from '../../../Unit/PowerUp/Condition/TimeUpCondition';
import { HealMenuItem } from '../../../../Menu/Buttons/HealMenuItem';
import { HealUp } from '../../../Unit/PowerUp/HealUp';
import { SpeedFieldMenuItem } from '../../../../Menu/Buttons/SpeedFieldMenuItem';
import { SpeedUp } from '../../../Unit/PowerUp/SpeedUp';
import { Explosion } from '../../../Unit/Explosion';
import { InfiniteFadeAnimation } from '../../../Animator/InfiniteFadeAnimation';

export class ReactorField extends Field implements ISelectable {
	//state
	public Battery: Battery;
	private _totalRange: number = 4;
	private _isLocked: boolean;
	private _range: number = 0;

	//UI
	public Appearance: ReactorAppearance;
	private _fireAnimation: BasicRangeAnimator;

	//cells
	private _area: Array<BasicItem> = new Array<BasicItem>();
	private _internalCells: CellContext<Cell> = new CellContext<Cell>();

	//events
	public OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	public OnPowerChanged: LiteEvent<boolean> = new LiteEvent<boolean>();
	public OnLost: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();
	public OnOverlocked: LiteEvent<string> = new LiteEvent<string>();

	constructor(
		cell: Cell,
		public Hq: Headquarter,
		private _context: GameContext,
		private _light: string,
		public IsPacific: boolean = false
	) {
		super(cell);
		this.Z = ZKind.Field;
		this.Hq.AddReactor(this);
		this.Battery = new Battery(this.Hq, this);
		this.GetCell().SetField(this);
		this.Appearance = new ReactorAppearance(this, this._light);
		this.GenerateSprite(Archive.selectionCell);
		this.SetProperty(Archive.selectionCell, (e) => {
			e.alpha = 0;
			e.anchor.set(0.5);
		});

		this.IsCentralRef = true;

		this.InitPosition(cell.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		this.RangeAnimation();
		this.Hq.AddField(this);

		if (this.GetHq() === this._context.GetMainHq()) {
			this.SetSelectionAnimation();
		}
	}

	public SetSelectionAnimation(): void {
		const white = new BasicItem(this.GetCell().GetBoundingBox(), Archive.selectionBlueReactor, ZKind.BelowCell);
		white.SetAnimator(new InfiniteFadeAnimation(white, Archive.selectionBlueReactor, 0, 1, 0.02));
		white.SetVisible(() => this.IsUpdatable);
		white.SetAlive(() => this.IsUpdatable);
	}

	public GetHq(): Headquarter {
		return this.Hq;
	}

	private StartOverclockAnimation(): void {
		this._fireAnimation = new BasicRangeAnimator(this.GetCell(), this._totalRange);
	}

	public IsLocked(): boolean {
		return this._isLocked;
	}

	private GetVehicles(): Array<Vehicle> {
		let vehicles = new Array<Vehicle>();

		this.GetAllCells().forEach((c) => {
			if (c.HasOccupier()) {
				const vehicle = c.GetOccupier() as Vehicle;
				if (!vehicle.IsEnemy(this.Hq)) {
					vehicles.push(vehicle);
				}
			}
		});
		return vehicles;
	}

	private GetPowerUp(type: any): string {
		if (type instanceof AttackMenuItem) {
			return 'AttackMenuItem';
		} else if (type instanceof HealMenuItem) {
			return 'HealMenuItem';
		} else if (type instanceof SpeedFieldMenuItem) {
			return 'SpeedFieldMenuItem';
		}
	}

	public StartLocked(type: any): void {
		this.OnOverlocked.Invoke(this, this.GetPowerUp(type));
		this.StartOverclockAnimation();
		this.SetLocked(true);
		const vehicles = this.GetVehicles();
		if (type instanceof AttackMenuItem) {
			vehicles.forEach((v) => {
				if (v.IsPacific) {
					return;
				}
				if (v instanceof Tank) {
					const sum = this.GetPower() * 5;
					v.SetPowerUp(new AttackUp(v, new TimeUpCondition(), sum));
				}
			});
		} else if (type instanceof HealMenuItem) {
			vehicles.forEach((v) => {
				if (v.IsPacific) {
					return;
				}
				const sum = this.GetPower();
				v.SetPowerUp(new HealUp(v, new TimeUpCondition(), sum));
			});
		} else if (type instanceof SpeedFieldMenuItem) {
			vehicles.forEach((v) => {
				if (v.IsPacific) {
					return;
				}
				const sum = this.GetPower() * 0.2;
				v.SetPowerUp(new SpeedUp(v, new TimeUpCondition(), sum, sum));
			});
		}
	}

	HasPower(): boolean {
		return 0 < this.Battery.GetUsedPower();
	}

	private _endLockDate: number;

	private SetLocked(l: boolean): void {
		this._isLocked = l;

		const duration = 30000;
		if (this._isLocked) {
			this._endLockDate = new Date(new Date().getTime() + duration).getTime();
			setTimeout(() => (this._isLocked = false), duration);
		}
	}

	GetLockDate(): number {
		return this._endLockDate;
	}

	private RangeAnimation(): void {
		if (this._range < this._totalRange) {
			this._range += 1;
			this.RefreshInternal();
			this.UpdateCellStates(this._range);
			setTimeout(() => this.RangeAnimation(), 1000);
		}
	}

	Support(vehicule: Vehicle): void {
		if (this.IsPacific) {
			return;
		}

		if (vehicule.Hq != this.Hq) {
			this.SetSelected(false);
			while (this.HasPower()) {
				this.PowerDown();
			}
			this.OnLost.Invoke(this, this);
			this.OnLost.Clear();

			this.Appearance.Destroy();
			this.GetCell().DestroyField();
			this.GetCell().GetIncludedRange(2).forEach((c) => {
				if (TypeTranslator.IsBonusField(c.GetField())) {
					c.DestroyField();
					if (c.IsVisible()) {
						new Explosion(c.GetBoundingBox(), Archive.constructionEffects, ZKind.AboveSky, false, 5);
					}
				}
			});

			var reactor = new ReactorField(
				this.GetCell(),
				vehicule.Hq,
				this._context,
				vehicule.Hq.GetSkin().GetLight()
			);
			vehicule.Hq.OnReactorConquested.Invoke(this, reactor);
		}
	}

	IsDesctrutible(): boolean {
		return false;
	}

	IsBlocking(): boolean {
		return false;
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}

	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		this.Appearance.Update(viewX, viewY);

		if (this._area) {
			this._area.forEach((area) => {
				area.Update(viewX, viewY);
			});
		}

		if (this._fireAnimation && !this._fireAnimation.IsDone) {
			this._fireAnimation.Update(viewX, viewY);
		}
	}

	public PowerUp(): void {
		const formerEnergy = this.Battery.GetUsedPower();
		this.Battery.High();

		if (formerEnergy === 0 && this.Battery.GetUsedPower() === 1) {
			this.OnPowerChanged.Invoke(this, true);
		}
	}

	public ForcePowerUp(battery: BatteryField) {
		const formerEnergy = this.Battery.GetUsedPower();
		this.Battery.ForceHigh(battery);

		if (formerEnergy === 0 && this.Battery.GetUsedPower() === 1) {
			this.OnPowerChanged.Invoke(this, true);
		}
	}

	public GetPower(): number {
		return this.Battery.GetUsedPower();
	}

	public PowerDown(): void {
		if (0 < this.Battery.GetUsedPower()) {
			this.Battery.Low();
			if (this.Battery.GetUsedPower() === 0) {
				this.OnPowerChanged.Invoke(this, false);
			}
		}
	}

	private UpdateCellStates(range: number) {
		CellStateSetter.SetStates(this._context, this.GetCell().GetAll(range));
	}

	SetSelected(isSelected: boolean): void {
		this.SetProperty(Archive.selectionCell, (e) => (e.alpha = isSelected ? 1 : 0));
		if (this.IsSelected()) {
			this.CreateArea();
		} else {
			this.ClearArea();
		}
		this.OnSelectionChanged.Invoke(this, this);
	}

	private CreateArea() {
		this.GetCell().GetSpecificRange(this._range).forEach((cell) => {
			const b = BoundingBox.CreateFromBox((<Cell>cell).GetBoundingBox());
			const area = new BasicItem(b, this.Hq.GetSkin().GetArea(), ZKind.AboveCell);
			area.SetVisible(() => true);
			area.SetAlive(() => true);

			this._area.push(area);
		});
	}

	public GetInternal(): CellContext<Cell> {
		if (this._internalCells.IsEmpty()) {
			this.RefreshInternal();
		}
		return this._internalCells;
	}

	public IsCovered(c: Cell): boolean {
		return this.GetInternal().Exist(c.GetHexCoo());
	}

	private RefreshInternal() {
		this._internalCells.Clear();
		this.GetCell().GetAllNeighbourhood(this._totalRange).forEach((cell) => {
			this._internalCells.Add(cell as Cell);
		});
		this._internalCells.Add(this.GetCell());
	}

	public GetAllCells(): Cell[] {
		return this.GetCell().GetAllNeighbourhood(this._totalRange).map((c) => c as Cell);
	}

	public Destroy(): void {
		super.Destroy();
		if (this._fireAnimation) {
			this._fireAnimation.Destroy();
		}
		if (this.Appearance) {
			this.Appearance.Destroy();
		}
		this._area.forEach((a) => a.Destroy());
		this._area = [];
	}

	private ClearArea() {
		this._area.forEach((a) => a.Destroy());
		this._area = [];
	}

	HasStock(): boolean {
		return this.Battery.HasStock();
	}

	IsSelected(): boolean {
		return this.GetCurrentSprites().Get(Archive.selectionCell).alpha === 1;
	}
}
