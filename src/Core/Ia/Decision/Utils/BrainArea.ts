import { TypeTranslator } from '../../../Items/Cell/Field/TypeTranslator';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { BrainAreaView } from './View/BrainAreaView';
import { ReactorField } from '../../../Items/Cell/Field/Bonus/ReactorField';
import { ShieldField } from '../../../Items/Cell/Field/Bonus/ShieldField';
import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';
import { BasicField } from '../../../Items/Cell/Field/BasicField';
import { FarmField } from '../../../Items/Cell/Field/Bonus/FarmField';
import { BlockingField } from '../../../Items/Cell/Field/BlockingField';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { DistanceHelper } from '../../../Items/Unit/MotionHelpers/DistanceHelper';
import { HeadquarterField } from '../../../Items/Cell/Field/Hq/HeadquarterField';
import { RoadField } from '../../../Items/Cell/Field/Bonus/RoadField';
import { AStarEngine } from '../../AStarEngine';
import { Area } from './Area';
import { Cell } from '../../../Items/Cell/Cell';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Tank } from '../../../Items/Unit/Tank';
import { Truck } from '../../../Items/Unit/Truck';
import { ReactorAreaState } from './ReactorAreaState';
import { AreaSearch } from './AreaSearch';
import { AStarHelper } from '../../AStarHelper';
import { Brain } from '../Brain';
import { Relationship } from '../../../Items/Identity';
import { Env } from '../../../../Env';
import { LogKind } from '../../../../Utils/Logger/LogKind';
import { StaticLogger } from '../../../../Utils/Logger/StaticLogger';

export class BrainArea {
	public Tanks: Array<Tank>;
	private _trucks: Truck[] = [];
	public OnTankChanged: LiteEvent<number>;
	public OnRequestAdded: LiteEvent<string>;
	public HasReceivedRequest: boolean;

	private _range: number = 0; //range from HQ
	private _viewArea: BrainAreaView;
	private _letters: string = 'abcdefghijklmnopqrstuvwxyz';
	private _name: string;
	private _isUnconnectable: boolean = false;
	private _outerFoes: number;
	private _innerFoes: number;
	private _isDestroyed: boolean = false;

	constructor(
		private _hq: Headquarter,
		private _spot: Area,
		private _globalIa: Brain,
		private _areaSearch: AreaSearch
	) {
		this._name =
			this._hq.Identity.Name[this._hq.Identity.Name.length - 1] + this._letters[_globalIa.BrainAreas.length];
		this.OnTankChanged = new LiteEvent<number>();
		this.OnRequestAdded = new LiteEvent<string>();
		if (!Env.IsPrd()) {
			this._viewArea = new BrainAreaView(this._hq, this);
		}
		this.Tanks = new Array<Tank>();
		let range = 1;
		let isFound = false;
		let areas = this._areaSearch.GetAreaRange(this._hq.GetCell().GetHexCoo(), range);
		const co = this._spot.GetCentralCell().GetHexCoo();

		while (!isFound) {
			if (areas.indexOf(co) !== -1) {
				isFound = true;
				this._range = range;
			} else {
				range += 1;
				areas = this._areaSearch.GetAreaRange(this._hq.GetCell().GetHexCoo(), range);
			}

			if (areas.length === 0) {
				isFound = true;
			}
		}
	}

	IsDestroyed(): boolean {
		return this._isDestroyed;
	}
	Destroy() {
		this._isDestroyed = true;
	}

	AddTruck(truck: Truck) {
		this._trucks.push(truck);
	}

	public GetTrucks(): Truck[] {
		this._trucks = this._trucks.filter((t) => t.IsAlive());
		return this._trucks;
	}

	public GetName(): string {
		return this._name.toUpperCase();
	}

	public ContainsTank(): boolean {
		return this.GetSpot().GetStatus().HasUnit(this._hq);
	}

	public GetRange(): number {
		return this._range;
	}

	public GetFoesAroundArea(): Array<Area> {
		return this.GetSpot().GetAroundAreas().filter((a) => a.GetStatus().HasFoesOf(this._hq));
	}

	public IsBorder(): boolean {
		return this._spot
			.GetAroundAreas()
			.some((aroundArea) => !this._globalIa.GetIaAreaByCell().Exist(aroundArea.GetCentralCell().Coo()));
	}

	public IsIsolated(): boolean {
		return this._spot
			.GetAroundAreas()
			.every((aroundArea) => !this._globalIa.GetIaAreaByCell().Exist(aroundArea.GetCentralCell().Coo()));
	}

	public HasHq(): boolean {
		return this._spot.GetStatus().HasField(HeadquarterField.name);
	}

	public GetReactor(): Cell {
		const r = this._hq.GetReactors().find((r) => this._spot.Contains(r.GetCell()));
		if (r) {
			return r.GetCell();
		} else {
			return null;
		}
	}

	public GetFoeReactor(): Cell {
		const cells = this._spot.GetCells();
		return cells.find((cell) => {
			TypeTranslator.IsReactorField(cell.GetField()) &&
				this._hq.Identity.GetRelation(cell.GetField().GetIdentity()) === Relationship.Enemy;
		});
	}

	public IsCovered(): ReactorAreaState {
		let covered = 0;
		this.GetSpot().GetCells().forEach((c) => {
			if (this._hq.IsCovered(c)) {
				covered += 1;
			}
		});
		if (covered === 7) {
			return ReactorAreaState.All;
		} else if (covered === 0) {
			return ReactorAreaState.None;
		} else {
			return ReactorAreaState.Partial;
		}
	}

	public GetFreeCoveredCells(): Cell[] {
		const result = new Array<Cell>();
		this.GetSpot().GetCells().forEach((c) => {
			if (this._hq.IsCovered(c) && !this.HasFoe(c) && c.GetField() instanceof BasicField) {
				result.push(c);
			}
		});
		return result;
	}

	private HasFoe(cell: Cell): boolean {
		return cell.GetAll(1).some((c) => TypeTranslator.GetRelation(c, this._hq.Identity) === Relationship.Enemy);
	}

	public IsImportant(): boolean {
		return (
			this._spot.GetStatus().HasField(Diamond.name) ||
			this._spot.GetStatus().HasField(HeadquarterField.name) ||
			this._spot.GetStatus().HasField(ReactorField.name)
		);
	}

	public HasCell(cell: Cell) {
		return this._spot.Contains(cell);
	}

	public HasFreeFields(): boolean {
		return this.GetSpot().GetStatus().HasField(BasicField.name);
	}

	public GetSpot(): Area {
		return this._spot;
	}

	public HasMedic(): boolean {
		return this.GetSpot().GetStatus().HasField(MedicField.name);
	}

	public HasDiamond(): boolean {
		return this.GetSpot().GetStatus().HasField(Diamond.name);
	}

	public GetDistanceFromHq(): number {
		return DistanceHelper.GetDistance(this.GetCentralCell().GetHexCoo(), this._hq.GetCell().GetHexCoo());
	}

	public GetCentralCell(): Cell {
		return this._spot.GetCentralCell();
	}

	public GetConnectingCentralCell(): Cell {
		if (!this._spot.GetCentralCell().IsBlocked()) {
			return this._spot.GetCentralCell();
		} else {
			if (this.HasRoadField()) {
				return this.GetRoadFields()[0];
			} else {
				if (this._spot.GetStatus().HasField(BasicField.name)) {
					return this._spot.GetStatus().GetCells([ BasicField.name ])[0];
				} else {
					return null;
				}
			}
		}
	}

	public GetClosesHqField(n: number): Cell[] {
		const result = new Array<Cell>();
		let i = 0;
		this.GetSpot()
			.GetCells()
			.sort((a, b) => {
				const ditanceA = DistanceHelper.GetDistance(this._hq.GetCell().GetHexCoo(), a.GetHexCoo());
				const ditanceB = DistanceHelper.GetDistance(this._hq.GetCell().GetHexCoo(), b.GetHexCoo());

				if (ditanceA < ditanceB) {
					return -1;
				}
				if (ditanceA > ditanceB) {
					return 1;
				}
				return 0;
			})
			.some((c) => {
				result.push(c);
				i += 1;
				return i === n;
			});

		return result;
	}

	public GetAllyAreas(): BrainArea[] {
		const spots = this._spot.GetAroundAreas();
		const allySpots = new Array<BrainArea>();
		const kingdom = this._globalIa.GetIaAreaByCell();
		spots.forEach((s) => {
			const coo = s.GetCentralCell().Coo();
			if (kingdom.Exist(coo)) {
				allySpots.push(kingdom.Get(coo));
			}
		});
		return allySpots;
	}

	public GetCells(fields: string[]): Cell[] {
		return this._spot.GetStatus().GetCells(fields);
	}

	public HasReactor(): boolean {
		return this._spot.GetStatus().HasField(ReactorField.name);
	}

	public HasFarmField(): boolean {
		return this._spot.GetStatus().HasField(FarmField.name);
	}

	public GetFarmCount(): number {
		return this._spot.GetStatus().Count(FarmField.name);
	}

	public GetMedicCount(): number {
		return this._spot.GetStatus().Count(MedicField.name);
	}

	public HasRoadField(): boolean {
		return this._spot.GetStatus().HasField(RoadField.name);
	}

	public GetRoadFields(): Cell[] {
		return this._spot.GetStatus().GetCells([ RoadField.name ]);
	}

	public HasNature(): boolean {
		if (this._spot.GetStatus().HasField(Diamond.name) || this._spot.GetStatus().HasField(HeadquarterField.name)) {
			return false;
		}
		return this._spot.GetStatus().HasField(BlockingField.name);
	}

	public GetNatures(): Cell[] {
		return this._spot.GetStatus().GetCells([ BlockingField.name ]);
	}

	public SetUnconnectable(): void {
		this._isUnconnectable = true;
	}

	public IsConnected(): boolean {
		const central = this.GetCentralCell();
		if (this.IsIsolated()) {
			return true;
		}

		if (central === this._hq.GetCell() || central.GetField() instanceof Diamond) {
			return true;
		}

		if (this._isUnconnectable) {
			return true;
		}

		if (!this.HasNature() && !this._spot.GetStatus().HasField(BasicField.name)) {
			return true;
		}

		return this._spot.GetStatus().HasFields([ RoadField.name ]);
	}

	private HasRoad(cell: Cell, count: number): boolean {
		const central = this.GetCentralCell();
		const filter = (c: Cell) => {
			let cell = c as Cell;
			return (
				cell !== null &&
				(cell.GetField() instanceof RoadField ||
					cell.GetField() instanceof ShieldField ||
					cell.GetField() instanceof HeadquarterField ||
					cell.GetField() instanceof Headquarter)
			);
		};
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		const pathFinder = new AStarEngine<Cell>(filter, cost);
		const path = pathFinder.GetPath(central, cell);
		return path !== null && path.length < count;
	}

	public HasAtLeastTwoConnections(): boolean {
		const allyAreas = this.GetAllyAreas();
		let connections = 0;
		if (allyAreas.length < 2) {
			return false;
		}

		allyAreas.forEach((allyArea) => {
			if (this.HasRoad(allyArea.GetCentralCell(), 5)) {
				connections += 1;
			}
		});

		if (2 <= connections) {
			return true;
		}
		return false;
	}

	public CalculateFoes(): void {
		this._outerFoes = this.CalculateOuterFoeCount();
		this._innerFoes = this.CalculateInnerFoeCount();
	}

	private CalculateOuterFoeCount(): number {
		let outsideEnemyCount = 0;
		this._spot.GetAroundAreas().forEach((area) => {
			outsideEnemyCount += area.GetStatus().GetFoeVehicleCount(this._hq);
		});
		return outsideEnemyCount;
	}

	private CalculateInnerFoeCount(): number {
		return this._spot.GetStatus().GetFoeVehicleCount(this._hq);
	}

	public GetOuterFoeCount(): number {
		return this._outerFoes;
	}

	public GetInnerFoeCount(): number {
		return this._innerFoes;
	}

	public GetAllFoeCount(): number {
		return this.GetInnerFoeCount() + this.GetOuterFoeCount();
	}

	public HasTank(): boolean {
		return this.Tanks.length > 0;
	}

	public IsTankDamaged(): boolean {
		return this.Tanks.some((t) => t.HasDamage()) && this.HasMedic();
	}

	public HasFreeTank(): boolean {
		return this.Tanks.some((t) => !t.IsBusy());
	}

	public Drop(): Tank {
		if (this.Tanks.length > 0) {
			let tank = this.Tanks.splice(0, 1)[0];
			tank.CancelOrder();
			return tank;
		}
		return null;
	}

	public DropSpecific(tank: Tank): boolean {
		if (this.Tanks.some((t) => t === tank)) {
			this.Tanks = this.Tanks.filter((t) => t !== tank);
			tank.CancelOrder();
			this.OnTankChanged.Invoke(this, this.Tanks.length);
			return true;
		}
		return false;
	}

	public Add(tank: Tank): void {
		this.Tanks.push(tank);
		this.OnTankChanged.Invoke(this, this.Tanks.length);
	}

	public GetFreeUnitCellCount(): number {
		return this._spot.GetFreeUnitCells().length;
	}

	public HasFreeUnitCell(): boolean {
		return 0 < this._spot.GetFreeUnitCells().length;
	}

	public GetRandomFreeUnitCell(): Cell {
		const cells = this._spot.GetFreeUnitCells();
		if (cells.length > 0) {
			let index = Math.floor(Math.random() * (cells.length - 1)) + 0;
			return cells[index];
		} else {
			return null;
		}
	}

	public GetHealSpot(): Cell {
		const freeCells = this._spot.GetFreeUnitCells().filter((c) => c.GetField() instanceof MedicField);
		if (0 < freeCells.length) {
			return freeCells[0];
		} else {
			return null;
		}
	}

	public GetFoesCount(): number {
		return this.GetOuterFoeCount() + this.GetInnerFoeCount();
	}

	public HasIdleTroops(): boolean {
		return (
			(this.GetFoesCount() == 0 && this.Tanks.length > 1) ||
			(this.GetFoesCount() == 0 && !this.IsBorder()) ||
			(this.GetInnerFoeCount() == 0 && this.GetOuterFoeCount() < this.Tanks.length + 2)
		);
	}
}
