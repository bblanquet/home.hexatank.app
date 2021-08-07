import { IHeadquarter } from './IHeadquarter';
import { Identity, Relationship } from './../../../Identity';
import { IBrain } from './../../../../Ia/Decision/IBrain';
import { HqNetwork } from './HqNetwork';
import { InfiniteFadeAnimation } from './../../../Animator/InfiniteFadeAnimation';
import { BasicItem } from './../../../BasicItem';
import { ZKind } from './../../../ZKind';
import { BatteryField } from '../Bonus/BatteryField';
import { LiteEvent } from '../../../../../Utils/Events/LiteEvent';
import { Tank } from '../../../Unit/Tank';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { Cell } from '../../Cell';
import { HeadquarterField } from './HeadquarterField';
import { AliveItem } from '../../../AliveItem';
import { IField } from '../IField';
import { Crater } from '../../../Environment/Crater';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { CellState } from '../../CellState';
import { BoundingBox } from '../../../../../Utils/Geometry/BoundingBox';
import { Vehicle } from '../../../Unit/Vehicle';
import { Explosion } from '../../../Unit/Explosion';
import { Truck } from '../../../Unit/Truck';
import { GameSettings } from '../../../../Framework/GameSettings';
import { ReactorField } from '../Bonus/ReactorField';
import { ISelectable } from '../../../../ISelectable';
import { HexAxial } from '../../../../../Utils/Geometry/HexAxial';
import { Item } from '../../../Item';
import { Curve } from '../../../../../Utils/Stats/Curve';
import { DateValue } from '../../../../../Utils/Stats/DateValue';
import { isNullOrUndefined } from '../../../../../Utils/ToolBox';

export class Headquarter extends AliveItem implements IField, ISelectable, IHeadquarter {
	private _boundingBox: BoundingBox;
	private _cell: Cell;
	public Fields: Array<HeadquarterField>;

	private _network: HqNetwork;
	private _brain: IBrain;

	private _diamondCurve: Curve = new Curve([], '');

	//belongs
	public DiamondCount: number = GameSettings.PocketMoney;
	private _reactors: Array<ReactorField> = new Array<ReactorField>();
	private _batteryFields: Array<BatteryField> = new Array<BatteryField>();
	private _vehicles: Array<Vehicle> = new Array<Vehicle>();

	private _onCellStateChanged: (obj: any, cellState: CellState) => void;
	public OnVehicleCreated: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();
	public OnDiamondCountChanged: LiteEvent<number> = new LiteEvent<number>();
	public OnDiamondEarned: LiteEvent<number> = new LiteEvent<number>();
	public OnFieldCountchanged: LiteEvent<number> = new LiteEvent<number>();
	public OnFieldAdded: LiteEvent<Cell> = new LiteEvent<Cell>();
	public OnEnergyChanged: LiteEvent<number> = new LiteEvent<number>();

	public OnReactorConquested: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();
	public OnReactorAdded: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();
	public OnReactorLost: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();

	public OnSelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	constructor(public Identity: Identity, cell: Cell) {
		super();
		this.Z = ZKind.Cell;
		this._cell = cell;

		this.GenerateSprite(SvgArchive.selectionUnit);
		this.SetProperty(SvgArchive.selectionUnit, (e) => (e.alpha = 0));

		this._boundingBox = BoundingBox.NewFromBox(this._cell.GetBoundingBox());

		this.GenerateSprite(this.Identity.Skin.GetHq());
		this.GenerateSprite(SvgArchive.building.hq.bottom);
		this.GenerateSprite(SvgArchive.building.hq.top);

		this.GetSprites().forEach((obj) => {
			obj.width = this._boundingBox.GetWidth();
			obj.height = this._boundingBox.GetHeight();
			obj.anchor.set(0.5);
		});
		this.IsCentralRef = true;

		var neighbours = this._cell.GetUnblockedRange();
		this.Fields = new Array<HeadquarterField>();
		neighbours.forEach((cell) => {
			this.Fields.push(cell.SetField(new HeadquarterField(this, <Cell>cell, this.Identity.Skin.GetLight())));
		});
		this._onCellStateChanged = this.OncellStateChanged.bind(this);
		this.OnDiamondEarned.On(this.HandleDiamondChanged.bind(this));
		this._cell.OnCellStateChanged.On(this._onCellStateChanged);
		this.InitPosition(cell.GetBoundingBox().GetPosition());

		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this._cell.IsVisible();
		});

		this._network = new HqNetwork(this);
		this.TotalLife = 200;
		this.Life = 200;
	}

	GetVehicles(): Vehicle[] {
		return this._vehicles;
	}

	public GetIdentity(): Identity {
		return this.Identity;
	}

	public SetSelectionAnimation(): void {
		const blue = new BasicItem(this._cell.GetBoundingBox(), SvgArchive.selectionBlueHq, ZKind.BelowCell);
		blue.SetVisible(() => this.IsAlive());
		blue.SetAlive(() => this.IsAlive());
		const white = new BasicItem(this._cell.GetBoundingBox(), SvgArchive.selectionWhiteHq, ZKind.BelowCell);
		white.SetAnimator(new InfiniteFadeAnimation(white, SvgArchive.selectionWhiteHq, 0, 1, 0.1));
		white.SetVisible(() => this.IsAlive());
		white.SetAlive(() => this.IsAlive());
	}

	SetPowerUp(vehicule: Vehicle): void {}
	protected OncellStateChanged(obj: any, cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	private _fields: Array<Item> = new Array<Item>();

	public AddField(field: Item, cell: Cell) {
		this._fields.push(field);
		this.OnFieldAdded.Invoke(this, cell);

		field.OnDestroyed.On((src: any, itm: Item) => {
			this._fields = this._fields.filter((t) => !t.IsUpdatable);
			this.OnFieldCountchanged.Invoke(this, this._fields.length);
		});
		this.OnFieldCountchanged.Invoke(this, this._fields.length);
	}

	public GetFieldCount(): number {
		return this._fields.length;
	}

	public GetCurrentCell(): Cell {
		return this._cell;
	}

	public GetDiamondCount(): number {
		return this.DiamondCount;
	}

	public GetRelation(id: Identity): Relationship {
		return this.Identity.GetRelation(id);
	}

	Support(vehicule: Vehicle): void {}

	IsDesctrutible(): boolean {
		return true;
	}
	GetCell(): Cell {
		return this._cell;
	}

	IsBlocking(): boolean {
		return true;
	}

	public CreateTank(cell: Cell = null): boolean {
		let isCreated = false;
		this.Fields.some((field) => {
			if (!field.GetCell().IsBlocked()) {
				if (field.GetCell().IsVisible()) {
					new Explosion(field.GetCell().GetBoundingBox(), SvgArchive.constructionEffects, ZKind.Sky, false);
				}
				const tank = new Tank(this.Identity);
				this.AddVehicle(tank);
				tank.SetPosition(cell === null ? field.GetCell() : cell);
				this.OnVehicleCreated.Invoke(this, tank);

				isCreated = true;
				return true;
			}
			return false;
		});

		return isCreated;
	}

	public CreateTruck(cell: Cell = null): boolean {
		let isCreated = false;
		this.Fields.some((field) => {
			if (!field.GetCell().IsBlocked()) {
				if (field.GetCell().IsVisible()) {
					new Explosion(field.GetCell().GetBoundingBox(), SvgArchive.constructionEffects, 5, false);
				}
				let truck = new Truck(this.Identity);
				this.AddVehicle(truck);
				truck.SetPosition(cell || field.GetCell());
				this.OnVehicleCreated.Invoke(this, truck);

				isCreated = true;
				return true;
			}
			return false;
		});

		return isCreated;
	}

	SetSelected(isSelected: boolean): void {
		this.SetProperty(SvgArchive.selectionUnit, (e) => (e.alpha = isSelected ? 1 : 0));
		this.OnSelectionChanged.Invoke(this, this);
	}
	IsSelected(): boolean {
		return this.GetCurrentSprites().Get(SvgArchive.selectionUnit).alpha === 1;
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Destroy(): void {
		super.Destroy();
		this._cell.OnCellStateChanged.Off(this._onCellStateChanged);
		this.IsUpdatable = false;
		this.Fields.forEach((field) => {
			field.Destroy();
		});
		this._vehicles.forEach((v) => v.SetDamage(v.GetCurrentLife()));
	}

	public OnCashMissing: LiteEvent<Boolean> = new LiteEvent<boolean>();
	private _cashMissedTimeout: any;
	public CashMissing(): void {
		if (this._cashMissedTimeout) {
			clearTimeout(this._cashMissedTimeout);
		}
		this.OnCashMissing.Invoke(this, true);
		this._cashMissedTimeout = setTimeout(() => {
			this.OnCashMissing.Invoke(this, false);
		}, 3000);
	}

	public IsIa(): boolean {
		return !isNullOrUndefined(this._brain) && this._brain.IsIa();
	}

	public Inject(brain: IBrain): void {
		this._brain = brain;
	}

	BuyTank(): void {
		const tankPrice = GameSettings.TankPrice * this.GetVehicleCount();
		if (this.Buy(tankPrice)) {
			this.CreateTank();
		}
	}
	BuyTruck(): void {
		const truckPrice = GameSettings.TruckPrice * this.GetVehicleCount();
		if (this.Buy(truckPrice)) {
			this.CreateTruck();
		}
	}

	public Update(): void {
		if (this._brain) {
			this._brain.Update();
		}
		this.SetProperty(SvgArchive.building.hq.bottom, (sprite) => (sprite.rotation += 0.1));

		if (!this.IsAlive()) {
			this.Destroy();
			new Crater(this._boundingBox);
			return;
		}

		super.Update();

		this.Fields.forEach((field) => {
			this.Earn(field.Diamonds);
			field.Diamonds = 0;
		});
	}

	public Buy(amount: number): boolean {
		if (this.DiamondCount >= amount) {
			this.DiamondCount -= amount;
			this.OnDiamondCountChanged.Invoke(this, this.DiamondCount);
			return true;
		} else {
			this.CashMissing();
		}
		return false;
	}

	public Earn(amount: number): void {
		if (amount !== 0) {
			this.DiamondCount += amount;
			this.OnDiamondCountChanged.Invoke(this, this.DiamondCount);
			if (0 < amount) {
				this.OnDiamondEarned.Invoke(this, amount);
			}
		}
	}

	public GetAmount(): number {
		return this.DiamondCount;
	}

	public HasMoney(cost: number): boolean {
		if (cost <= this.DiamondCount) {
			return true;
		}
		return false;
	}

	public GetVehicleCount(): number {
		return this._vehicles.length;
	}

	public GetTankCount(): number {
		return this._vehicles.filter((v) => v instanceof Tank).length;
	}

	public AddVehicle(v: Vehicle): void {
		this._vehicles.push(v);
		v.OnDestroyed.On((e: any, ve: Vehicle) => {
			this._vehicles = this._vehicles.filter((v) => v.IsAlive());
		});
	}

	public GetReactorsCount(): number {
		return this._reactors.length;
	}

	public GetReactors(): Array<ReactorField> {
		return this._reactors;
	}

	public IsCovered(cell: Cell): boolean {
		return this._reactors.filter((reactor) => !reactor.IsLost && reactor.IsCovered(cell)).length > 0;
	}

	public AddReactor(reactor: ReactorField): void {
		this._reactors.push(reactor);
		this.OnReactorAdded.Invoke(this, reactor);
		reactor.OnPowerChanged.On((src: any, data: boolean) => {
			this.OnEnergyChanged.Invoke(this, 0);
		});
		reactor.OnLost.On((e: any, ie: ReactorField) => {
			this._reactors = this._reactors.filter((v) => v !== ie);
			this.OnReactorLost.Invoke(this, ie);
			this.OnEnergyChanged.Invoke(this, 0);
		});
	}

	public AddBatteryField(energyField: BatteryField): void {
		this._batteryFields.push(energyField);
		const reactors = this._reactors.filter((c) => c.IsCovered(energyField.GetCell()));
		if (reactors.length === 1) {
			reactors[0].EnergyUp();
		}
	}

	public GetBatteryFields(): Array<BatteryField> {
		this._batteryFields = this._batteryFields.filter((b) => b.IsUpdatable);
		return this._batteryFields;
	}

	public GetTotalEnergy(): number {
		return this._batteryFields.length;
	}

	public GetCellEnergy(coo: HexAxial): number {
		let result = 0;
		this._reactors.forEach((r) => {
			if (r.GetInternal().Exist(coo.ToString())) {
				result += r.GetPower();
			}
		});
		return result;
	}

	public GetCellTotalEnergy(): number {
		let result = 0;
		this._reactors.forEach((r) => {
			if (r.GetInternal()) {
				result += r.GetPower();
			}
		});
		return result;
	}

	private HandleDiamondChanged(src: Headquarter, diamond: number): void {
		this._diamondCurve.Points.push(new DateValue(new Date().getTime(), diamond));
	}

	public GetEarnedDiamond(milliseconds: number) {
		const d = Date.now() - milliseconds;
		const ps = this._diamondCurve.Points.filter((p) => d < p.X);
		if (0 < ps.length) {
			return ps.map((p) => p.Amount).reduce((a, b) => a + b);
		} else {
			return 0;
		}
	}
}
