import { GameHelper } from '../../../Framework/GameHelper';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { FlagCell } from '../FlagCell';
import { Tank } from '../../Unit/Tank';
import { PacketKind } from '../../../../Components/Network/PacketKind';
import { PeerHandler } from '../../../../Components/Network/Host/On/PeerHandler';
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
	SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	private _boundingBox: BoundingBox;
	private _cell: Cell;
	public PlayerName: string;
	public VehicleId: number = 0;
	protected Fields: Array<HeadQuarterField>;
	private _diamondCount: number = GameSettings.PocketMoney;
	private _skin: ItemSkin;
	private _onCellStateChanged: { (obj: any, cellState: CellState): void };
	public Flagcell: FlagCell;
	private _influenceFields: Array<InfluenceField> = new Array<InfluenceField>();
	private _vehicles: Array<Vehicle> = new Array<Vehicle>();

	constructor(skin: ItemSkin, cell: Cell) {
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

	public CreateTank(pos: Cell = null): boolean {
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
					GameHelper.Playground.Items.push(explosion);
				}
				this.VehicleId += 1;
				const tank = new Tank(this);
				tank.Id = `${this.PlayerName}${this.VehicleId}`;
				tank.SetPosition(pos === null ? field.GetCell() : pos);
				GameHelper.VehiclesContainer.Add(tank);
				GameHelper.Playground.Items.push(tank);
				isCreated = true;
				this.NotifyTank(tank);
				if (this.Flagcell) {
					tank.SetOrder(new SimpleOrder(this.Flagcell.GetCell(), tank));
				}
				return false;
			}
			return true;
		});

		return isCreated;
	}

	protected NotifyTank(tank: Tank) {
		PeerHandler.SendMessage(PacketKind.Create, {
			Type: 'Tank',
			Id: tank.Id,
			cell: tank.GetCurrentCell().GetCoordinate(),
			Hq: this._cell.GetCoordinate()
		});
	}

	protected NotifyTruck(truck: Truck) {
		PeerHandler.SendMessage(PacketKind.Create, {
			Type: 'Truck',
			Id: truck.Id,
			cell: truck.GetCurrentCell().GetCoordinate(),
			Hq: this._cell.GetCoordinate()
		});
	}

	public CreateTruck(pos: Cell = null): boolean {
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
					GameHelper.Playground.Items.push(explosion);
				}
				this.VehicleId += 1;
				let truck = new Truck(this);
				truck.Id = `${this.PlayerName}${this.VehicleId}`;
				truck.SetPosition(pos === null ? field.GetCell() : pos);
				GameHelper.VehiclesContainer.Add(truck);
				GameHelper.Playground.Items.push(truck);
				isCreated = true;
				this.NotifyTruck(truck);
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
		GameHelper.Render.Remove(this);
		this._cell.CellStateChanged.Off(this._onCellStateChanged);
		this._cell.DestroyField();
		this.IsUpdatable = false;
		this.Fields.forEach((field) => {
			field.Destroy();
		});
	}

	private _tankRequestCount: number = 0;
	public TankRequestEvent: LiteEvent<number> = new LiteEvent<number>();

	public GetTankRequests(): number {
		return this._tankRequestCount;
	}

	public AddTankRequest(): void {
		if (this._tankRequestCount < 4) {
			this._tankRequestCount += 1;
			this.TankRequestEvent.Invoke(this, this._tankRequestCount);
			if (this._diamondCount < GameSettings.TankPrice) {
				GameHelper.SetWarning();
			}
		}
	}

	public RemoveTankRequest(): void {
		if (this._tankRequestCount > 0) {
			this._tankRequestCount -= 1;
			this.TankRequestEvent.Invoke(this, this._tankRequestCount);
		}
	}

	private _truckRequestCount: number = 0;
	public TruckRequestEvent: LiteEvent<number> = new LiteEvent<number>();

	public GetTruckRequests(): number {
		return this._truckRequestCount;
	}

	public AddTruckRequest(): void {
		if (this._truckRequestCount < 4) {
			this._truckRequestCount += 1;
			this.TruckRequestEvent.Invoke(this, this._truckRequestCount);
			if (this._diamondCount < GameSettings.TruckPrice) {
				GameHelper.SetWarning();
			}
		}
	}

	public RemoveTruckRequest(): void {
		if (this._truckRequestCount > 0) {
			this._truckRequestCount -= 1;
			this.TruckRequestEvent.Invoke(this, this._truckRequestCount);
		}
	}

	public Update(viewX: number, viewY: number): void {
		while (this._truckRequestCount > 0 && this._diamondCount >= GameSettings.TruckPrice) {
			if (this.Buy(GameSettings.TruckPrice * this.GetVehicleCount())) {
				if (this.CreateTruck()) {
					this.RemoveTruckRequest();
				} else {
					//no available slots
					break;
				}
			}
		}

		while (this._tankRequestCount > 0 && this._diamondCount >= GameSettings.TankPrice) {
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
			GameHelper.Playground.Items.push(crater);
			return;
		}

		super.Update(viewX, viewY);

		this.Fields.forEach((field) => {
			field.Update(viewX, viewY);
			this.Earn(field.Diamonds);
			field.Diamonds = 0;
		});
	}

	public DiamondCountEvent: LiteEvent<number> = new LiteEvent<number>();

	public Buy(amount: number): boolean {
		if (this._diamondCount >= amount) {
			this._diamondCount -= amount;
			this.DiamondCountEvent.Invoke(this, this._diamondCount);
			return true;
		} else {
			GameHelper.SetWarning();
		}
		return false;
	}

	public Earn(amount: number): void {
		this._diamondCount += amount;
		this.DiamondCountEvent.Invoke(this, this._diamondCount);
	}

	protected GetAmount(): number {
		return this._diamondCount;
	}

	public HasMoney(cost: number): boolean {
		if (cost <= this._diamondCount) {
			return true;
		}
		if (this === GameHelper.PlayerHeadquarter) {
			GameHelper.SetWarning();
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
