import { TroopDecisionMaker } from './../Troop/TroopDecisionMaker';
import { HealField } from './../../../Items/Cell/Field/HealField';
import { BasicField } from './../../../Items/Cell/Field/BasicField';
import { MoneyField } from './../../../Items/Cell/Field/MoneyField';
import { Diamond } from './../../../Items/Cell/Field/Diamond';
import { DistanceHelper } from './../../../Items/Unit/MotionHelpers/DistanceHelper';
import { HeadQuarterField } from './../../../Items/Cell/Field/HeadquarterField';
import { FastField } from './../../../Items/Cell/Field/FastField';
import { ICell } from './../../../Items/Cell/ICell';
import { AStarEngine } from './../../AStarEngine';
import { IKingdomDecisionMaker } from '../IKingdomDecisionMaker';
import { Area } from './Area';
import { Cell } from '../../../Items/Cell/Cell';
import { Headquarter } from '../../../Items/Cell/Field/Headquarter';
import { Tank } from '../../../Items/Unit/Tank';
import { Truck } from '../../../Items/Unit/Truck';

export class KingdomArea {
	public Troops: Array<TroopDecisionMaker>;
	public Truck: Truck;
	constructor(private _hq: Headquarter, private _spot: Area, private _kindgom: IKingdomDecisionMaker) {
		this.Troops = new Array<TroopDecisionMaker>();
	}

	public IsBorder(): boolean {
		return this._spot
			.GetAroundAreas()
			.some(
				(aroundArea) =>
					!this._kindgom.GetKingdomAreas().Exist(aroundArea.GetCentralCell().GetCoordinate().ToString())
			);
	}

	public IsImportant(): boolean {
		return this._spot.HasDiamond() || this._spot.HasHq();
	}

	public HasFreeCells(): boolean {
		return 0 < this._spot.GetCells().filter((c) => c.GetField() instanceof BasicField).length;
	}

	public GetSpot(): Area {
		return this._spot;
	}

	public HasMedic(): boolean {
		return this._spot.GetCells().some((c) => c.GetField() instanceof HealField);
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
			if (this.HasFastField()) {
				return this.GetFastFields()[0];
			} else {
				return this._spot.GetFreeCells()[0];
			}
		}
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
		return this._spot.GetCells().some((c) => c.GetField() instanceof MoneyField);
	}

	public HasFastField(): boolean {
		return this._spot.GetCells().some((c) => c.GetField() instanceof FastField);
	}

	public GetFastFields(): Cell[] {
		return this._spot.GetCells().filter((c) => c.GetField() instanceof FastField);
	}

	public HasNature(): boolean {
		if (this.IsImportant()) {
			return false;
		}
		return this._spot.GetCells().some((c) => c.HasShootableField());
	}

	public GetNatures(): Cell[] {
		return this._spot.GetCells().filter((c) => c.HasShootableField());
	}

	public IsConnected(): boolean {
		const central = this.GetCentralCell();
		if (central === this._hq.GetCell() || central.GetField() instanceof Diamond) {
			return true;
		}

		return this._spot.GetCells().some((c) => c.GetField() instanceof FastField);

		// const central = this.GetCentralCell();
		// if (central.IsBlocked()) {
		// 	if (central === this._hq.GetCell() || central.GetField() instanceof Diamond) {
		// 		return true;
		// 	}
		// 	return this._spot.GetCells().some((c) => c.GetField() instanceof FastField);
		// } else {
		// 	return this.HasRoad(this._hq.GetCell(), 100);
		// }
	}

	private HasRoad(cell: Cell, count: number): boolean {
		const central = this.GetCentralCell();
		const pathFinder = new AStarEngine<Cell>((c: ICell) => {
			let cell = c as Cell;
			return (
				cell !== null &&
				(cell.GetField() instanceof FastField ||
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

	public GetOuterFoeCount(): number {
		let outsideEnemyCount = 0;
		this._spot.GetAroundAreas().forEach((area) => {
			outsideEnemyCount += area.GetFoeCount(this._hq);
		});
		return outsideEnemyCount;
	}

	private GetOuterAllyCount(): number {
		let outsideEnemyCount = 0;
		this._spot.GetAroundAreas().forEach((area) => {
			outsideEnemyCount += area.GetAllyCount(this._hq);
		});
		return outsideEnemyCount;
	}

	public GetInnerFoeCount(): number {
		return this._spot.GetFoeCount(this._hq);
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
		const freeCells = this._spot.GetFreeCells().filter((c) => c.GetField() instanceof HealField);
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
