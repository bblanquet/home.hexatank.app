import { UpCalculator } from './UpCalculator';
import { Dictionnary } from './../../../../Utils/Collections/Dictionnary';
import { Charge } from '../Hq/Charge';
import { ZKind } from './../../../ZKind';
import { BatteryField } from './BatteryField';
import { TypeTranslator } from '../TypeTranslator';
import { BasicRangeAnimator } from '../../../Animator/BasicRangeAnimator';
import { ReactorAppearance } from './ReactorAppearance';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { CellStateSetter } from '../../CellStateSetter';
import { ReactorReserve } from '../ReactorReserve';
import { BasicItem } from '../../../BasicItem';
import { ISelectable } from '../../../../ISelectable';
import { Field } from '../Field';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Vehicle } from '../../../Unit/Vehicle';
import { IInteractionContext } from '../../../../Interaction/IInteractionContext';
import { Cell } from '../../Cell';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { AttackMenuItem } from '../../../../Menu/Buttons/AttackMenuItem';
import { Tank } from '../../../Unit/Tank';
import { FireUp } from '../../../Unit/PowerUp/FireUp';
import { TimeUpCondition } from '../../../Unit/PowerUp/Condition/TimeUpCondition';
import { HealMenuItem } from '../../../../Menu/Buttons/HealMenuItem';
import { HealUp } from '../../../Unit/PowerUp/HealUp';
import { SpeedFieldMenuItem } from '../../../../Menu/Buttons/SpeedFieldMenuItem';
import { SpeedUp } from '../../../Unit/PowerUp/SpeedUp';
import { Explosion } from '../../../Unit/Explosion';
import { InfiniteFadeAnimation } from '../../../Animator/InfiniteFadeAnimation';
import { HqNetworkLink } from '../Hq/HqNetworkLink';
import { Item } from '../../../Item';
import { ISpot } from '../../../../Utils/Geometry/ISpot';
import { IHeadquarter } from '../Hq/IHeadquarter';
import { Identity, Relationship } from '../../../Identity';
import { IHqGameContext } from '../../../../Setup/Context/IHqGameContext';

export class ReactorField extends Field implements ISelectable, ISpot<ReactorField> {
	public Identity: Identity;
	private _bonusValueProvider: UpCalculator = new UpCalculator();
	//state
	public Reserve: ReactorReserve;
	private _totalRange: number = 3;
	private _isLocked: boolean;
	private _range: number = 0;

	public Links: Array<HqNetworkLink> = [];
	public Charges: Dictionnary<Charge> = new Dictionnary<Charge>();

	//UI
	public Appearance: ReactorAppearance;
	private _overlockAnimation: BasicRangeAnimator;

	//cells
	private _area: Array<BasicItem> = new Array<BasicItem>();
	private _internalCells: Dictionnary<Cell> = new Dictionnary<Cell>();

	//events
	public OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	public OnPowerChanged: LiteEvent<boolean> = new LiteEvent<boolean>();
	public OnLost: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();
	public OnOverlocked: LiteEvent<string> = new LiteEvent<string>();

	constructor(
		cell: Cell,
		public Hq: IHeadquarter,
		private _context: IHqGameContext,
		private _light: string,
		public IsPacific: boolean = false
	) {
		super(cell, Hq.Identity);
		this.Identity = this.Hq.Identity;
		this.Z = ZKind.Field;
		this.Hq.AddReactor(this);
		this.Reserve = new ReactorReserve(this.Hq, this);
		this.Appearance = new ReactorAppearance(this, this._light);
		this.GenerateSprite(SvgArchive.selectionCell);
		this.SetProperty(SvgArchive.selectionCell, (e) => {
			e.alpha = 0;
			e.anchor.set(0.5);
		});

		this.IsCentralRef = true;

		this.InitPosition(cell.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		this.RangeAnimation();
		this.Hq.AddField(this, cell);

		if (this.GetHq() === this._context.GetPlayerHq()) {
			this.SetSelectionAnimation();
		}
	}

	public AddLink(link: HqNetworkLink): void {
		this.Links.push(link);
		link.OnDestroyed.On((e: any, d: Item) => (this.Links = this.Links.filter((e) => !e.IsDestroyed())));
	}

	public SetSelectionAnimation(): void {
		const white = new BasicItem(this.GetCell().GetBoundingBox(), SvgArchive.selectionBlueReactor, ZKind.BelowCell);
		white.SetAnimator(new InfiniteFadeAnimation(white, SvgArchive.selectionBlueReactor, 0, 1, 0.02));
		white.SetVisible(() => this.IsUpdatable);
		white.SetAlive(() => this.IsUpdatable);
	}

	public GetHq(): IHeadquarter {
		return this.Hq;
	}

	private StartOverclockAnimation(): void {
		this._overlockAnimation = new BasicRangeAnimator(this.GetCell(), this._totalRange);
	}

	public GetConnectedReactors(): Array<ReactorField> {
		const result = new Array<ReactorField>();
		this.GetAllReactors(this, result);
		return result;
	}

	private GetAllReactors(currentReactor: ReactorField, result: Array<ReactorField>): void {
		if (result.every((e) => e !== currentReactor)) {
			result.push(currentReactor);
			currentReactor.Links.forEach((link) => {
				const r = link.GetReactors().filter((r) => r !== currentReactor)[0];
				this.GetAllReactors(r, result);
			});
		}
	}

	public IsLocked(): boolean {
		return this._isLocked;
	}

	private GetVehicles(): Array<Vehicle> {
		const vehicles = new Dictionnary<Vehicle>();

		this.GetAllCells().forEach((c) => {
			if (c.HasOccupier()) {
				const vehicle = c.GetOccupier() as Vehicle;
				if (vehicle.GetRelation(this.Hq.Identity) === Relationship.Ally && !vehicles.Exist(vehicle.Id)) {
					vehicles.Add(vehicle.Id, vehicle);
				}
			}
		});
		return vehicles.Values();
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

	public Overclock(type: any): void {
		if (!this._isLocked) {
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
						const powerUp = this._bonusValueProvider.GetAttack(this.GetPower());
						v.AddPowerUp(new FireUp(v, new TimeUpCondition(), powerUp));
					}
				});
			} else if (type instanceof HealMenuItem) {
				vehicles.forEach((v) => {
					if (v.IsPacific) {
						return;
					}
					const powerUp = this._bonusValueProvider.GetHeal(this.GetPower());
					v.AddPowerUp(new HealUp(v, new TimeUpCondition(), powerUp));
				});
			} else if (type instanceof SpeedFieldMenuItem) {
				vehicles.forEach((v) => {
					if (v.IsPacific) {
						return;
					}
					v.AddPowerUp(new SpeedUp(v, new TimeUpCondition(), this.GetPower()));
				});
			}
		}
	}

	public HasPower(): boolean {
		return 0 < this.Reserve.GetUsedPower();
	}

	public ClearPower(): void {}

	private _endLockDate: number;

	private SetLocked(l: boolean): void {
		this._isLocked = l;

		const duration = 30000;
		if (this._isLocked) {
			this._endLockDate = new Date(new Date().getTime() + duration).getTime();
			setTimeout(() => (this._isLocked = false), duration);
		}
	}

	public GetLockDate(): number {
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

	public Support(vehicule: Vehicle): void {
		if (this.IsPacific) {
			return;
		}

		if (vehicule.Identity.Name != this.Hq.Identity.Name) {
			this.SetSelected(false);
			this.Reserve.Clear();
			this.OnLost.Invoke(this, this);
			this.OnLost.Clear();

			this.Appearance.Destroy();
			this.Charges.Values().forEach((charge) => {
				charge.Destroy();
			});
			this.Charges.Clear();

			this.GetCell().GetIncludedRange(this._totalRange).forEach((c) => {
				if (
					TypeTranslator.IsBonusField(c.GetField()) &&
					!this.Hq.IsCovered(c) &&
					this.Hq.GetRelation(c.GetField().GetIdentity()) === Relationship.Ally
				) {
					c.GetField().Destroy();
					if (c.IsVisible()) {
						new Explosion(c.GetBoundingBox(), SvgArchive.constructionEffects, ZKind.Sky, false, 5);
					}
				}
			});

			const hq = this._context.GetHqFromId(vehicule.Identity);
			const cell = this.GetCell();
			var reactor = cell.SetField(new ReactorField(cell, hq, this._context, hq.Identity.Skin.GetLight()));
			hq.OnReactorConquested.Invoke(this, reactor);
		}
	}

	public IsDesctrutible(): boolean {
		return false;
	}

	public IsBlocking(): boolean {
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

		if (this._overlockAnimation && !this._overlockAnimation.IsDone) {
			this._overlockAnimation.Update(viewX, viewY);
		}

		if (this.Charges) {
			this.Charges.Values().forEach((charge) => {
				charge.Update(viewX, viewY);
			});
		}
	}

	public GetInternalBatteries(): Array<BatteryField> {
		const result = new Array<BatteryField>();
		this.Hq.GetBatteryFields().filter((f) => !f.IsUsed()).forEach((battery) => {
			if (this._internalCells.Exist(battery.GetCell().Coo())) {
				result.push(battery);
			}
		});
		return result;
	}

	public EnergyUp(): void {
		const formerEnergy = this.Reserve.GetUsedPower();
		this.Reserve.High();

		if (formerEnergy === 0 && this.Reserve.GetUsedPower() === 1) {
			this.OnPowerChanged.Invoke(this, true);
		}
	}

	public GetPower(): number {
		return this.Reserve.GetUsedPower();
	}

	public EnergyDown(): void {
		if (0 < this.Reserve.GetUsedPower()) {
			this.Reserve.Low();
			if (this.Reserve.GetUsedPower() === 0) {
				this.OnPowerChanged.Invoke(this, false);
			}
		}
	}

	private UpdateCellStates(range: number) {
		CellStateSetter.SetStates(this.GetCell().GetAll(range));
	}

	public SetSelected(isSelected: boolean): void {
		this.SetProperty(SvgArchive.selectionCell, (e) => (e.alpha = isSelected ? 1 : 0));
		if (this.IsSelected()) {
			this.CreateArea();
		} else {
			this.ClearArea();
		}
		this.OnSelectionChanged.Invoke(this, this);
	}

	private CreateArea() {
		this.GetCell().GetRange(this._range).forEach((cell) => {
			const b = BoundingBox.CreateFromBox((<Cell>cell).GetBoundingBox());
			const area = new BasicItem(b, this.Hq.Identity.Skin.GetArea(), ZKind.AboveCell);
			area.SetVisible(() => true);
			area.SetAlive(() => true);

			this._area.push(area);
		});
	}

	public GetInternal(): Dictionnary<Cell> {
		if (this._internalCells.IsEmpty()) {
			this.RefreshInternal();
		}
		return this._internalCells;
	}

	public IsCovered(c: Cell): boolean {
		return this.GetInternal().Exist(c.Coo());
	}

	private RefreshInternal() {
		this._internalCells.Clear();
		this.GetCell().GetNearby(this._totalRange).forEach((cell) => {
			this._internalCells.Add(cell.Coo(), cell as Cell);
		});
		this._internalCells.Add(this.GetCell().Coo(), this.GetCell());
	}

	public GetAllCells(): Cell[] {
		return this.GetCell().GetNearby(this._totalRange).map((c) => c as Cell);
	}

	public Destroy(): void {
		super.Destroy();
		this.Links.forEach((l) => l.Destroy());
		this.Links = [];
		if (this._overlockAnimation) {
			this._overlockAnimation.Destroy();
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

	public HasStock(): boolean {
		return this.Reserve.HasStock();
	}

	public IsSelected(): boolean {
		return this.GetCurrentSprites().Get(SvgArchive.selectionCell).alpha === 1;
	}

	public GetUnblockedRange(): ReactorField[] {
		const nearvyReactors = this.Links.map((l) => l.GetOpposite(this));
		return nearvyReactors;
	}
	public GetFilteredNearby(condition: (spot: ReactorField) => boolean): ReactorField[] {
		const nearvyReactors = this.Links.map((l) => l.GetOpposite(this)).filter((r) => condition(r));
		return nearvyReactors;
	}
	public GetDistance(spot: ReactorField): number {
		return this.GetCell().GetHexCoo().GetDistance(spot.GetCell().GetHexCoo());
	}
	public IsEqualed(spot: ReactorField): boolean {
		return spot.GetCell() === this.GetCell();
	}
}
