import { AreaEngine } from './AreaEngine';
import { Area } from './Area';
import { Cell } from '../../Items/Cell/Cell';
import { TroopDecisionMaker } from './TroopDecisionMaker';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { AreaStatus } from './AreaStatus';
import { AreaDecisionMaker } from './AreaDecisionMaker';
import { GameHelper } from '../../Framework/GameHelper';
import { Tank } from '../../Items/Unit/Tank';
import { CellContext } from '../../Items/Cell/CellContext';

export class HeldArea {
	private _areaDecisionMaker: AreaDecisionMaker;
	private _troops: Array<TroopDecisionMaker>;
	public HasReceivedRequest: boolean;

	constructor(private _hq: Headquarter, private _area: Area, private _cells: CellContext<Cell>) {
		this._troops = new Array<TroopDecisionMaker>();
		this._areaDecisionMaker = new AreaDecisionMaker(this, this._cells);
	}

	public GetArea(): Area {
		return this._area;
	}

	public GetTroops(): Array<TroopDecisionMaker> {
		return this._troops;
	}

	public Update(): void {
		this._troops = this._troops.filter((t) => t.Tank.IsAlive());

		if (this._troops.length > 1) {
			console.log(
				`%c AREA  ${this._troops.length} -> ${this._area.GetCentralCell().GetCoordinate().ToString()}`,
				'font-weight:bold;'
			);
		}

		if (0 < this.GetInsideEnemyCount()) {
			this._areaDecisionMaker.Update();
		} else {
			this._troops.forEach((troop) => {
				troop.Update();
			});
		}
	}

	public GetCentralCell(): Cell {
		return this._area.GetCentralCell();
	}

	public GetStatus(): AreaStatus {
		this._troops = this._troops.filter((t) => t.Tank.IsAlive());
		return new AreaStatus(
			this.GetOutsideEnemyCount(),
			this.GetInsideEnemyCount(),
			this._troops.length,
			this.GetOutsideAllyCount(),
			this
		);
	}

	private GetOutsideEnemyCount(): number {
		let outsideEnemyCount = 0;
		new AreaEngine<Cell>()
			.GetExcludedFirstRange(this._cells, this._area.GetCentralCell())
			.map((c) => new Area(c))
			.forEach((area) => {
				outsideEnemyCount += area.GetEnemyCount(this._hq);
			});
		return outsideEnemyCount;
	}

	private GetOutsideAllyCount(): number {
		let outsideEnemyCount = 0;
		new AreaEngine<Cell>()
			.GetExcludedFirstRange(this._cells, this._area.GetCentralCell())
			.map((c) => new Area(c))
			.forEach((area) => {
				outsideEnemyCount += area.GetAllyCount(this._hq);
			});
		return outsideEnemyCount;
	}

	private GetInsideEnemyCount(): number {
		return this._area.GetEnemyCount(this._hq);
	}

	public HasTroop(): boolean {
		return this._troops.length > 0;
	}

	public DropTroop(): Tank {
		if (this._troops.length > 0) {
			let troop = this._troops.splice(0, 1)[0];
			troop.Cancel();
			return troop.Tank;
		}
		return null;
	}

	public AddTroop(tank: Tank, cell: Cell): void {
		this._troops.push(new TroopDecisionMaker(cell, tank, this));
	}

	public GetAvailablecellCount(): number {
		return this._area
			.GetAvailablecell()
			.filter((c) => this._troops.filter((t) => c === t.CurrentPatrolDestination).length === 0).length;
	}

	public GetAvailablecell(): Cell {
		const cells = this._area
			.GetAvailablecell()
			.filter((c) => this._troops.filter((t) => c === t.CurrentPatrolDestination).length === 0);

		if (cells.length > 0) {
			let index = Math.floor(Math.random() * (cells.length - 1)) + 0;
			return cells[index];
		} else {
			return null;
		}
	}
}
