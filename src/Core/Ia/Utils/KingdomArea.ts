import { AreaSearch } from './AreaSearch';
import { Area } from './Area';
import { Cell } from '../../Items/Cell/Cell';
import { TroopDecisionMaker } from '../Decision/Troop/TroopDecisionMaker';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { AreaStatus } from './AreaStatus';
import { Tank } from '../../Items/Unit/Tank';
import { CellContext } from '../../Items/Cell/CellContext';

export class KingdomArea {
	public Troops: Array<TroopDecisionMaker>;
	public HasReceivedRequest: boolean;

	constructor(private _hq: Headquarter, public Area: Area, private _cells: CellContext<Cell>) {
		this.Troops = new Array<TroopDecisionMaker>();
	}

	public GetArea(): Area {
		return this.Area;
	}

	public GetTroops(): Array<TroopDecisionMaker> {
		return this.Troops;
	}

	public GetCentralCell(): Cell {
		return this.Area.GetCentralCell();
	}

	public GetStatus(): AreaStatus {
		this.Troops = this.Troops.filter((t) => t.Tank.IsAlive());
		return new AreaStatus(
			this.GetOutsideEnemyCount(),
			this.GetInnerFoeCount(),
			this.Troops.length,
			this.GetOutsideAllyCount(),
			this
		);
	}

	private GetOutsideEnemyCount(): number {
		let outsideEnemyCount = 0;
		new AreaSearch()
			.GetExcludedFirstRange(this._cells.Keys(), this.Area.GetCentralCell().GetCoordinate())
			.map((coo) => new Area(this._cells.Get(coo)))
			.forEach((area) => {
				outsideEnemyCount += area.GetFoeCount(this._hq);
			});
		return outsideEnemyCount;
	}

	private GetOutsideAllyCount(): number {
		let outsideEnemyCount = 0;
		new AreaSearch()
			.GetExcludedFirstRange(this._cells.Keys(), this.Area.GetCentralCell().GetCoordinate())
			.map((coo) => new Area(this._cells.Get(coo)))
			.forEach((area) => {
				outsideEnemyCount += area.GetAllyCount(this._hq);
			});
		return outsideEnemyCount;
	}

	public GetInnerFoeCount(): number {
		return this.Area.GetFoeCount(this._hq);
	}

	public HasTroop(): boolean {
		return this.Troops.length > 0;
	}

	public DropTroop(): Tank {
		if (this.Troops.length > 0) {
			let troop = this.Troops.splice(0, 1)[0];
			troop.Cancel();
			return troop.Tank;
		}
		return null;
	}

	public AddTroop(tank: Tank, cell: Cell): void {
		this.Troops.push(new TroopDecisionMaker(cell, tank, this));
	}

	public GetFreeCellCount(): number {
		return this.Area
			.GetFreeCells()
			.filter((c) => this.Troops.filter((t) => c === t.CurrentPatrolDestination).length === 0).length;
	}

	public GetRandomFreeCell(): Cell {
		const cells = this.Area
			.GetFreeCells()
			.filter((c) => this.Troops.filter((t) => c === t.CurrentPatrolDestination).length === 0);

		if (cells.length > 0) {
			let index = Math.floor(Math.random() * (cells.length - 1)) + 0;
			return cells[index];
		} else {
			return null;
		}
	}
}
