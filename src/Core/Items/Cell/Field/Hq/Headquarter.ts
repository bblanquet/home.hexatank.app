import { BatteryField } from '../Bonus/BatteryField';
import { GameContext } from '../../../../Framework/GameContext';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { FlagCell } from '../../FlagCell';
import { Tank } from '../../../Unit/Tank';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { Cell } from '../../Cell';
import { HeadQuarterField } from './HeadquarterField';
import { AliveItem } from '../../../AliveItem';
import { IField } from '../IField';
import { Crater } from '../../../Environment/Crater';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { CellState } from '../../CellState';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { ItemSkin } from '../../../ItemSkin';
import { IHqContainer } from '../../../Unit/IHqContainer';
import { Vehicle } from '../../../Unit/Vehicle';
import { Explosion } from '../../../Unit/Explosion';
import { Truck } from '../../../Unit/Truck';
import { SimpleOrder } from '../../../../Ia/Order/SimpleOrder';
import { GameSettings } from '../../../../Framework/GameSettings';
import { ReactorField } from '../Bonus/ReactorField';
import { ISelectable } from '../../../../ISelectable';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';

export class Headquarter extends AliveItem implements IField, ISelectable {
	public Flagcell: FlagCell;
	SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	private _boundingBox: BoundingBox;
	private _cell: Cell;
	public PlayerName: string;
	public Fields: Array<HeadQuarterField>;
	private _diamondCount: number = GameSettings.PocketMoney;
	private _skin: ItemSkin;
	private _onCellStateChanged: (obj: any, cellState: CellState) => void;
	private _reactors: Array<ReactorField> = new Array<ReactorField>();
	private _batteryFields: Array<BatteryField> = new Array<BatteryField>();

	private _vehicles: Array<Vehicle> = new Array<Vehicle>();
	public VehicleCreated: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();
	public ReactorConquested: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();
	public ReactorLost: LiteEvent<ReactorField> = new LiteEvent<ReactorField>();

	constructor(skin: ItemSkin, cell: Cell, public GameContext: GameContext) {
		super();
		this._skin = skin;
		this.Z = 2;
		this._cell = cell;
		this._cell.SetField(this);

		this.GenerateSprite(Archive.selectionUnit);
		this.SetProperty(Archive.selectionUnit, (e) => (e.alpha = 0));

		this._boundingBox = new BoundingBox();
		this._boundingBox.Width = this._cell.GetBoundingBox().Width;
		this._boundingBox.Height = this._cell.GetBoundingBox().Height;
		this._boundingBox.X = this._cell.GetBoundingBox().X;
		this._boundingBox.Y = this._cell.GetBoundingBox().Y;

		this.GenerateSprite(this.GetSkin().GetHq());
		this.GenerateSprite(Archive.building.hq.bottom);
		this.GenerateSprite(Archive.building.hq.top);

		this.GetSprites().forEach((obj) => {
			obj.width = this._boundingBox.Width;
			obj.height = this._boundingBox.Height;
			obj.anchor.set(0.5);
		});
		this.IsCentralRef = true;

		var neighbours = this._cell.GetNeighbourhood();
		this.Fields = new Array<HeadQuarterField>();
		neighbours.forEach((cell) => {
			this.Fields.push(new HeadQuarterField(this, <Cell>cell, skin.GetLight()));
		});
		this._onCellStateChanged = this.OncellStateChanged.bind(this);
		this._cell.CellStateChanged.On(this._onCellStateChanged);
		this.InitPosition(cell.GetBoundingBox());

		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this._cell.IsVisible();
		});
	}
	SetPowerUp(vehicule: Vehicle): void {}
	protected OncellStateChanged(obj: any, cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public GetCurrentCell(): Cell {
		return this._cell;
	}

	private IsHqContainer(item: any): item is IHqContainer {
		return 'Hq' in item;
	}

	public IsEnemy(item: AliveItem): boolean {
		if (this.IsHqContainer(item as any)) {
			return (<IHqContainer>(item as any)).Hq !== this;
		} else if (item instanceof Headquarter) {
			return <Headquarter>(item as any) !== this;
		}
		return false;
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

	public GetSkin(): ItemSkin {
		return this._skin;
	}

	public CreateTank(cell: Cell = null): boolean {
		let isCreated = false;
		this.Fields.every((field) => {
			if (!field.GetCell().IsBlocked()) {
				if (field.GetCell().IsVisible()) {
					new Explosion(field.GetCell().GetBoundingBox(), Archive.constructionEffects, 5, false, 5);
				}
				const tank = new Tank(this, this.GameContext);
				tank.SetPosition(cell === null ? field.GetCell() : cell);
				this.VehicleCreated.Invoke(this, tank);

				isCreated = true;
				if (this.Flagcell) {
					tank.SetOrder(new SimpleOrder(this.Flagcell.GetCell(), tank));
				}
				return false;
			}
			return true;
		});

		return isCreated;
	}

	public CreateTruck(cell: Cell = null): boolean {
		let isCreated = false;
		this.Fields.every((field) => {
			if (!field.GetCell().IsBlocked()) {
				if (field.GetCell().IsVisible()) {
					new Explosion(field.GetCell().GetBoundingBox(), Archive.constructionEffects, 5, false, 5);
				}
				let truck = new Truck(this, this.GameContext);
				truck.SetPosition(cell || field.GetCell());
				this.VehicleCreated.Invoke(this, truck);

				isCreated = true;
				return false;
			}
			return true;
		});

		return isCreated;
	}

	SetSelected(isSelected: boolean): void {
		this.SetProperty(Archive.selectionUnit, (e) => (e.alpha = isSelected ? 1 : 0));
		this.SelectionChanged.Invoke(this, this);
	}
	IsSelected(): boolean {
		return this.GetCurrentSprites().Get(Archive.selectionUnit).alpha === 1;
	}

	public GetBoundingBox(): BoundingBox {
		return this._boundingBox;
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Destroy(): void {
		super.Destroy();
		this._cell.CellStateChanged.Off(this._onCellStateChanged);
		this._cell.DestroyField();
		this.IsUpdatable = false;
		this.Fields.forEach((field) => {
			field.Destroy();
		});
	}

	private _tankRequestCount: number = 0;
	public OnTankRequestChanged: LiteEvent<number> = new LiteEvent<number>();

	public GetTankRequests(): number {
		return this._tankRequestCount;
	}

	public AddTankRequest(): void {
		if (this._tankRequestCount < 4) {
			this._tankRequestCount += 1;
			const tankPrice = GameSettings.TankPrice * this.GetVehicleCount();
			this.OnTankRequestChanged.Invoke(this, this._tankRequestCount);
			if (this._diamondCount < tankPrice) {
				this.CashMissing();
			}
		}
	}

	public RemoveTankRequest(): void {
		if (this._tankRequestCount > 0) {
			this._tankRequestCount -= 1;
			this.OnTankRequestChanged.Invoke(this, this._tankRequestCount);
		}
	}

	private _truckRequestCount: number = 0;
	public OnTruckRequestChanged: LiteEvent<number> = new LiteEvent<number>();

	public GetTruckRequests(): number {
		return this._truckRequestCount;
	}

	public AddTruckRequest(): void {
		if (this._truckRequestCount < 4) {
			this._truckRequestCount += 1;
			const truckPrice = GameSettings.TruckPrice * this.GetVehicleCount();
			this.OnTruckRequestChanged.Invoke(this, this._truckRequestCount);
			if (this._diamondCount < truckPrice) {
				this.CashMissing();
			}
		}
	}

	public RemoveTruckRequest(): void {
		if (this._truckRequestCount > 0) {
			this._truckRequestCount -= 1;
			this.OnTruckRequestChanged.Invoke(this, this._truckRequestCount);
		}
	}

	public OnCashMissing: LiteEvent<Boolean> = new LiteEvent<boolean>();
	private _cashMissedTimeout: NodeJS.Timeout;
	public CashMissing(): void {
		if (this._cashMissedTimeout) {
			clearTimeout(this._cashMissedTimeout);
		}
		this.OnCashMissing.Invoke(this, true);
		this._cashMissedTimeout = setTimeout(() => {
			this.OnCashMissing.Invoke(this, false);
		}, 3000);
	}

	public Update(viewX: number, viewY: number): void {
		const truckPrice = GameSettings.TruckPrice * this.GetVehicleCount();
		while (0 < this._truckRequestCount && truckPrice <= this._diamondCount) {
			if (this.Buy(truckPrice)) {
				if (this.CreateTruck()) {
					this.RemoveTruckRequest();
				} else {
					//no available slots
					break;
				}
			}
		}

		const tankPrice = GameSettings.TankPrice * this.GetVehicleCount();
		while (0 < this._tankRequestCount && tankPrice <= this._diamondCount) {
			if (this.Buy(GameSettings.TankPrice * this.GetVehicleCount())) {
				if (this.CreateTank()) {
					this.RemoveTankRequest();
				} else {
					//no available slots
					break;
				}
			}
		}

		this.SetProperty(Archive.building.hq.bottom, (sprite) => (sprite.rotation += 0.1));

		if (!this.IsAlive()) {
			this.Destroy();
			let crater = new Crater(this._boundingBox);

			return;
		}

		super.Update(viewX, viewY);

		this.Fields.forEach((field) => {
			field.Update(viewX, viewY);
			this.Earn(field.Diamonds);
			field.Diamonds = 0;
		});
	}

	public OnDiamondCountChanged: LiteEvent<number> = new LiteEvent<number>();

	public Buy(amount: number): boolean {
		if (this._diamondCount >= amount) {
			this._diamondCount -= amount;
			this.OnDiamondCountChanged.Invoke(this, this._diamondCount);
			return true;
		} else {
			this.CashMissing();
		}
		return false;
	}

	public Earn(amount: number): void {
		this._diamondCount += amount;
		this.OnDiamondCountChanged.Invoke(this, this._diamondCount);
	}

	public GetAmount(): number {
		return this._diamondCount;
	}

	public HasMoney(cost: number): boolean {
		if (cost <= this._diamondCount) {
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
		v.Destoyed.On((e: any, ve: Vehicle) => {
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
		return this._reactors.filter((c) => c.IsCovered(cell)).length > 0;
	}

	public AddReactor(reactor: ReactorField): void {
		this._reactors.push(reactor);
		reactor.Lost.On((e: any, ie: ReactorField) => {
			this._reactors = this._reactors.filter((v) => v !== ie);
			this.ReactorLost.Invoke(this, ie);
		});
	}

	public AddBatteryField(energyField: BatteryField): void {
		this._batteryFields.push(energyField);
	}

	public GetBatteryFields(): Array<BatteryField> {
		this._batteryFields = this._batteryFields.filter((b) => b.IsUpdatable);
		return this._batteryFields;
	}

	public GetTotalEnergy(): number {
		return this._batteryFields.length;
	}

	GetCellEnergy(coo: HexAxial): number {
		let result = 0;
		this._reactors.forEach((r) => {
			if (r.GetInternal().Exist(coo)) {
				result += r.GetPower();
			}
		});
		return result;
	}
}