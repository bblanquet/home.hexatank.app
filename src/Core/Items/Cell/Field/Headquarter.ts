import { GameContext } from './../../../Framework/GameContext';
import { GameHelper } from '../../../Framework/GameHelper';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { FlagCell } from '../FlagCell';
import { Tank } from '../../Unit/Tank';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { Cell } from '../Cell';
import { HeadQuarterField } from './HeadquarterField';
import { AliveItem } from '../../AliveItem';
import { IField } from './IField';
import { Crater } from '../../Environment/Crater';
import { Archive } from '../../../Framework/ResourceArchiver';
import { CellState } from '../CellState';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { ItemSkin } from '../../ItemSkin';
import { IHqContainer } from '../../Unit/IHqContainer';
import { Vehicle } from '../../Unit/Vehicle';
import { Explosion } from '../../Unit/Explosion';
import { Truck } from '../../Unit/Truck';
import { SimpleOrder } from '../../../Ia/Order/SimpleOrder';
import { GameSettings } from '../../../Framework/GameSettings';
import { InfluenceField } from './InfluenceField';
import { ISelectable } from '../../../ISelectable';

export class Headquarter extends AliveItem implements IField, ISelectable {
	public Flagcell: FlagCell;
	SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	private _boundingBox: BoundingBox;
	private _cell: Cell;
	public PlayerName: string;
	protected Fields: Array<HeadQuarterField>;
	private _diamondCount: number = GameSettings.PocketMoney;
	private _skin: ItemSkin;
	private _onCellStateChanged: (obj: any, cellState: CellState) => void;
	private _influenceFields: Array<InfluenceField> = new Array<InfluenceField>();
	private _vehicles: Array<Vehicle> = new Array<Vehicle>();
	public OnVehiculeCreated: LiteEvent<Vehicle> = new LiteEvent<Vehicle>();

	constructor(skin: ItemSkin, cell: Cell, protected GameContext: GameContext) {
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
			this.Fields.push(new HeadQuarterField(this, <Cell>cell, skin.GetCell()));
		});
		this._onCellStateChanged = this.OncellStateChanged.bind(this);
		this._cell.CellStateChanged.On(this._onCellStateChanged);
		this.InitPosition(cell.GetBoundingBox());

		this.GetDisplayObjects().forEach((obj) => {
			obj.visible = this._cell.IsVisible();
		});
	}
	protected OncellStateChanged(obj: any, cellState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
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
					const explosion = new Explosion(
						field.GetCell().GetBoundingBox(),
						Archive.constructionEffects,
						5,
						false,
						5
					);
				}
				const tank = new Tank(this, this.GameContext);
				tank.SetPosition(cell === null ? field.GetCell() : cell);
				this.OnVehiculeCreated.Invoke(this, tank);

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
					const explosion = new Explosion(
						field.GetCell().GetBoundingBox(),
						Archive.constructionEffects,
						5,
						false,
						5
					);
				}
				let truck = new Truck(this, this.GameContext);
				truck.SetPosition(cell === null ? field.GetCell() : cell);
				this.OnVehiculeCreated.Invoke(this, truck);

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
		return this.GetCurrentSprites()[Archive.selectionUnit].alpha === 1;
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

		this.GetBothSprites(Archive.building.hq.bottom).forEach((sprite) => (sprite.rotation += 0.1));

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

	protected GetAmount(): number {
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

	public AddVehicle(v: Vehicle): void {
		this._vehicles.push(v);
		v.Destoyed.On((e: any, ve: Vehicle) => {
			this._vehicles = this._vehicles.filter((v) => v.IsAlive());
		});
	}

	public GetInfluenceCount(): number {
		return this._influenceFields.length;
	}

	public GetInfluence(): Array<InfluenceField> {
		return this._influenceFields;
	}

	public AddInfluence(i: InfluenceField): void {
		this._influenceFields.push(i);
		i.Lost.On((e: any, ie: InfluenceField) => {
			this._influenceFields = this._influenceFields.filter((v) => v !== ie);
		});
	}

	public GetTotalEnergy(): number {
		return this._influenceFields.map((i) => i.GetInternalEnergy()).reduce((a, e) => a + e, 0);
	}
}
