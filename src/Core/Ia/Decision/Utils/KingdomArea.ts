import { ShieldField } from './../../../Items/Cell/Field/Bonus/ShieldField';
import { isNullOrUndefined } from 'util';
import { MedicField } from './../../../Items/Cell/Field/Bonus/MedicField';
import { BasicField } from './../../../Items/Cell/Field/BasicField';
import { FarmField } from './../../../Items/Cell/Field/Bonus/FarmField';
import { BlockingField } from './../../../Items/Cell/Field/BlockingField';
import { TroopDecisionMaker } from './../Troop/TroopDecisionMaker';
import { Diamond } from './../../../Items/Cell/Field/Diamond';
import { DistanceHelper } from './../../../Items/Unit/MotionHelpers/DistanceHelper';
import { HeadQuarterField } from '../../../Items/Cell/Field/Hq/HeadquarterField';
import { RoadField } from '../../../Items/Cell/Field/Bonus/RoadField';
import { ICell } from './../../../Items/Cell/ICell';
import { AStarEngine } from './../../AStarEngine';
import { IKingdomDecisionMaker } from '../IKingdomDecisionMaker';
import { Area } from './Area';
import { Cell } from '../../../Items/Cell/Cell';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Tank } from '../../../Items/Unit/Tank';
import { Truck } from '../../../Items/Unit/Truck';
import { ReactorAreaState } from './ReactorAreaState';
import { AreaSearch } from './AreaSearch';

export class KingdomArea {
	public Troops: Array<TroopDecisionMaker>;
	public Truck: Truck;
	private _range: number = 0;

	constructor(
		private _hq: Headquarter,
		private _spot: Area,
		private _kindgom: IKingdomDecisionMaker,
		private _areaSearch: AreaSearch
	) {
		this.Troops = new Array<TroopDecisionMaker>();
		let range = 1;
		let isFound = false;
		let areas = this._areaSearch.GetAreaRange(this._hq.GetCell().GetCoordinate(), range);
		const co = this._spot.GetCentralCell().GetCoordinate();

		while (!isFound) {
			if (areas.indexOf(co) !== -1) {
				isFound = true;
				this._range = range;
			} else {
				range += 1;
				areas = this._areaSearch.GetAreaRange(this._hq.GetCell().GetCoordinate(), range);
			}

			if (areas.length === 0) {
				isFound = true;
			}
		}
	}

	public GetRange(): number {
		return this._range;
	}

	public IsBorder(): boolean {
		return this._spot
			.GetAroundAreas()
			.some(
				(aroundArea) =>
					!this._kindgom.GetKingdomAreas().Exist(aroundArea.GetCentralCell().GetCoordinate().ToString())
			);
	}

	HasHq(): boolean {
		return this._spot.GetStatus().HasField(HeadQuarterField.name);
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

	public IsImportant(): boolean {
		return this._spot.GetStatus().HasField(Diamond.name) || this._spot.GetStatus().HasField(HeadQuarterField.name);
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

	public GetTroops(): Array<TroopDecisionMaker> {
		return this.Troops;
	}

	public GetDistanceFromHq(): number {
		return DistanceHelper.GetDistance(this.GetCentralCell().GetCoordinate(), this._hq.GetCell().GetCoordinate());
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
				return this._spot.GetFreeCells()[0];
			}
		}
	}

	public GetClosesHqField(n: number): Cell[] {
		const result = new Array<Cell>();
		let i = 0;
		this.GetSpot()
			.GetCells()
			.sort((a, b) => {
				const ditanceA = DistanceHelper.GetDistance(this._hq.GetCell().GetCoordinate(), a.GetCoordinate());
				const ditanceB = DistanceHelper.GetDistance(this._hq.GetCell().GetCoordinate(), b.GetCoordinate());

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

	public GetAllyAreas(): KingdomArea[] {
		const spots = this._spot.GetAroundAreas();
		const allySpots = new Array<KingdomArea>();
		const kingdom = this._kindgom.GetKingdomAreas();
		spots.forEach((s) => {
			const coo = s.GetCentralCell().GetCoordinate().ToString();
			if (kingdom.Exist(coo)) {
				allySpots.push(kingdom.Get(coo));
			}
		});
		return allySpots;
	}

	public HasFarmField(): boolean {
		return this._spot.GetStatus().HasField(FarmField.name);
	}

	public HasRoadField(): boolean {
		return this._spot.GetStatus().HasField(RoadField.name);
	}

	public GetRoadFields(): Cell[] {
		return this._spot.GetStatus().GetCells(RoadField.name);
	}

	public HasNature(): boolean {
		if (this.IsImportant()) {
			return false;
		}
		return this._spot.GetStatus().HasField(BlockingField.name);
	}

	public GetNatures(): Cell[] {
		return this._spot.GetStatus().GetCells(BlockingField.name);
	}

	public IsConnected(): boolean {
		const central = this.GetCentralCell();
		if (central === this._hq.GetCell() || central.GetField() instanceof Diamond) {
			return true;
		}

		if (!this.HasNature() && !this._spot.GetStatus().HasField(BasicField.name)) {
			return true;
		}
		if (!this.HasNature() && this.GetFreeCellCount() === 0) {
			return true;
		}

		return this._spot.GetStatus().HasFields([ RoadField.name ]);
	}

	private HasRoad(cell: Cell, count: number): boolean {
		const central = this.GetCentralCell();
		const pathFinder = new AStarEngine<Cell>((c: ICell) => {
			let cell = c as Cell;
			return (
				cell !== null &&
				(cell.GetField() instanceof RoadField ||
					cell.GetField() instanceof ShieldField ||
					cell.GetField() instanceof HeadQuarterField ||
					cell.GetField() instanceof Headquarter)
			);
		});
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

	private _outerFoes: number;
	private _innerFoes: number;

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

	private GetOuterAllyCount(): number {
		let outsideEnemyCount = 0;
		this._spot.GetAroundAreas().forEach((area) => {
			outsideEnemyCount += area.GetAllyCount(this._hq);
		});
		return outsideEnemyCount;
	}

	public GetInnerFoeCount(): number {
		return this._innerFoes;
	}

	public GetAllFoeCount(): number {
		return this.GetInnerFoeCount() + this.GetOuterFoeCount();
	}

	public HasTroop(): boolean {
		return this.Troops.length > 0;
	}

	public IsTroopHealing(): boolean {
		return this.Troops.map((t) => t.Tank).some((t) => t.HasDamage()) && this.HasMedic();
	}

	public IsTroopFighting(): boolean {
		const result = this.Troops.map((t) => t.Tank).some((t) => t.HasTarget());
		return result;
	}

	public DropTroop(): Tank {
		if (this.Troops.length > 0) {
			let troop = this.Troops.splice(0, 1)[0];
			troop.Cancel();
			return troop.Tank;
		}
		return null;
	}

	public DropSpecificTroop(troop: TroopDecisionMaker): boolean {
		if (this.Troops.some((t) => t === troop)) {
			this.Troops = this.Troops.filter((t) => t !== troop);
			troop.Cancel();
			return true;
		}
		return false;
	}

	public AddTroop(tank: Tank, cell: Cell): void {
		this.Troops.push(new TroopDecisionMaker(cell, tank, this));
	}

	public GetFreeCellCount(): number {
		return this._spot
			.GetFreeCells()
			.filter((c) => this.Troops.filter((t) => c === t.CurrentPatrolDestination).length === 0).length;
	}

	public GetRandomFreeCell(): Cell {
		const cells = this._spot
			.GetFreeCells()
			.filter((c) => this.Troops.filter((t) => c === t.CurrentPatrolDestination).length === 0);

		if (cells.length > 0) {
			let index = Math.floor(Math.random() * (cells.length - 1)) + 0;
			return cells[index];
		} else {
			return null;
		}
	}

	public GetHealSpot(): Cell {
		const freeCells = this._spot.GetFreeCells().filter((c) => c.GetField() instanceof MedicField);
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
			(this.GetFoesCount() == 0 && this.Troops.length > 1) ||
			(this.GetFoesCount() == 0 && !this.IsBorder()) ||
			(this.GetInnerFoeCount() == 0 && this.GetOuterFoeCount() < this.Troops.length + 2)
		);
	}
}
