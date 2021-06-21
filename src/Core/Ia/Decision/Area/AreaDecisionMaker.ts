import { MonitoredOrder } from '../../Order/MonitoredOrder';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { IAreaDecisionMaker } from './IAreaDecisionMaker';
import { AStarHelper } from '../../AStarHelper';
import { AttackField } from '../../../Items/Cell/Field/Bonus/AttackField';
import { IaArea } from '../Utils/IaArea';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { TroopRoads } from '../Troop/TroopRoads';
import { Cell } from '../../../Items/Cell/Cell';
import { Area } from '../Utils/Area';
import { Tank } from '../../../Items/Unit/Tank';
import { Groups } from '../../../Utils/Collections/Groups';
import { TroopDestination } from '../Utils/TroopDestination';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { GameSettings } from '../../../Framework/GameSettings';
import { BasicField } from '../../../Items/Cell/Field/BasicField';
import { AStarEngine } from '../../AStarEngine';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class AreaDecisionMaker implements IAreaDecisionMaker {
	public HasReceivedRequest: boolean;
	private _isDestroyed: boolean = false;

	constructor(private _hq: Headquarter, public Area: IaArea) {}

	public Update(): void {
		this.Area.Troops = this.Area.Troops.filter((t) => t.Tank.IsAlive());

		if (0 < this.Area.GetFoesCount()) {
			this.Dispatch();
		} else {
			this.Area.Troops.forEach((troop) => {
				troop.Update();
			});
		}
	}

	IsDestroyed(): boolean {
		return this._isDestroyed;
	}

	Destroy(): void {
		this._isDestroyed = true;
	}

	private Dispatch(): void {
		if (0 < this.Area.GetTroops().length) {
			this.LogTroopCount();
			const ally = this.Area.GetTroops()[0].Tank;

			//#1 get in & out cells
			const areas = this.GetAround(this.Area.GetSpot());

			//#2 get enemies cells
			const foeCells = this.GetFoeCells(areas, ally);

			//console.log(`%c [DETECTED FOE] ${foeCells.length}`, 'font-weight:bold;color:blue;');

			this.FireCell();
			this.SendTroops(foeCells, ally);
		}
	}

	private GetAround(area: Area): Area[] {
		const as = new Array<Area>();
		area.GetAroundAreas().forEach((a) => {
			as.push(a);
		});
		as.push(area);

		return as;
	}

	private FireCell(): void {
		this.Area.GetTroops().filter((t) => t.IsCloseFromEnemy()).forEach((t) => {
			let cell = t.Tank.GetCurrentCell();
			if (GameSettings.FieldPrice < this._hq.GetAmount()) {
				if (cell.GetField() instanceof BasicField && this._hq.IsCovered(cell)) {
					new AttackField(cell, this._hq);
					this._hq.Buy(GameSettings.FieldPrice);
				}
			}
		});
	}

	private SendTroops(foeCells: Cell[], ally: Tank) {
		//#3 get enemy contact cells
		const aroundFoeCells = this.GetAroundFoeCells(foeCells);

		//console.log(`%c [FREE FOE CELL] ${Object.keys(aroundFoeCells).length}`, 'font-weight:bold;color:red;');

		//#4 classify cell dangerous
		const cellsByDanger = this.ClassifyCellDanger(aroundFoeCells, ally);

		//#5 find path to reach cells and classify them
		const troopRoads = this.GetTroopRoads(cellsByDanger);

		//#6 select path
		const bestTroopRoads = this.FindBestRoads(troopRoads);

		//#7 give orders to units
		if (!isNullOrUndefined(bestTroopRoads)) {
			bestTroopRoads.Keys().forEach((coordinate) => {
				bestTroopRoads.Get(coordinate).forEach((troopSituation) => {
					this.LogOrder(troopSituation);
					troopSituation.Troop.Tank.GiveOrder(
						new MonitoredOrder(troopSituation.CurrentDestination.Destination, troopSituation.Troop.Tank)
					);
				});
			});
		}
	}

	private GetAroundFoeCells(enemycells: Array<Cell>): Dictionnary<Cell> {
		const enemyContactcells = new Dictionnary<Cell>();
		enemycells.forEach((enemycell) => {
			enemycell.GetUnblockedRange().forEach((cell) => {
				let coo = cell.Coo();
				if (!enemyContactcells.Exist(coo)) {
					enemyContactcells.Add(coo, cell as Cell);
				}
			});
		});
		return enemyContactcells;
	}

	private ClassifyCellDanger(aroundFoeCells: Dictionnary<Cell>, ally: Tank): { [danger: number]: Dictionnary<Cell> } {
		var dangerLevelcells: { [danger: number]: Dictionnary<Cell> } = {};

		aroundFoeCells.Keys().forEach((key) => {
			const currentcell = aroundFoeCells.Get(key);
			const coordinate = currentcell.Coo();
			const dangerLevel = this.GetAroundCellFoes(currentcell, ally);

			if (!dangerLevelcells.hasOwnProperty(dangerLevel)) {
				dangerLevelcells[dangerLevel] = new Dictionnary<Cell>();
			}

			if (!dangerLevelcells[dangerLevel].hasOwnProperty(coordinate)) {
				dangerLevelcells[dangerLevel].Add(coordinate, currentcell);
			}
		});
		return dangerLevelcells;
	}

	private GetAroundCellFoes(currentcell: Cell, ally: Tank) {
		return currentcell.GetNearby().map((c) => c as Cell).filter((c) => !isNullOrUndefined(c) && c.HasEnemy(ally))
			.length;
	}

	private FindBestRoads(troopRoads: TroopRoads[]): Groups<TroopRoads> {
		this.SetTroopDestination(troopRoads);
		let unresolvedCases = 0;
		var hasConflicts = true;
		const excludedcells = new Dictionnary<Cell>();
		while (hasConflicts) {
			if (unresolvedCases === 4) {
				return null;
			}

			unresolvedCases++;
			hasConflicts = false;
			var destTroops = this.GetTroopsByDest(troopRoads);
			destTroops.Keys().forEach((dest) => {
				if (1 < destTroops.Get(dest).length) {
					excludedcells.Add(dest, destTroops.Get(dest)[0].CurrentDestination.Destination);

					let cells = new Array<Cell>();
					excludedcells.Values().forEach((cell) => {
						cells.push(cell);
					});

					this.ResolveConflicts(destTroops.Get(dest), cells);
				}
			});
			destTroops = this.GetTroopsByDest(troopRoads);
			destTroops.Keys().forEach((dest) => {
				if (1 < destTroops.Get(dest).length) {
					hasConflicts = true;
				}
			});
		}

		return destTroops;
	}

	private SetTroopDestination(troopSituations: TroopRoads[]): void {
		troopSituations.forEach((troopSituation) => {
			troopSituation.CurrentDestination = troopSituation.GetClosestAndSafestPath();
		});
	}

	private GetTroopsByDest(troopSituations: TroopRoads[]): Groups<TroopRoads> {
		var troopsByDest = new Groups<TroopRoads>();
		troopSituations.forEach((troopSituation) => {
			const key = troopSituation.CurrentDestination.Destination.Coo();
			troopsByDest.Add(key, troopSituation);
		});
		return troopsByDest;
	}

	private GetTroopRoads(cellsByDanger: { [id: number]: Dictionnary<Cell> }): Array<TroopRoads> {
		let allTroopRoads = new Array<TroopRoads>();

		this.Area.GetTroops().filter((t) => !t.IsCloseFromEnemy()).forEach((troop) => {
			const troopRoads = new TroopRoads();
			troopRoads.Troop = troop;
			allTroopRoads.push(troopRoads);

			for (let danger in cellsByDanger) {
				const cells = cellsByDanger[danger];
				cells.Keys().forEach((coordinate) => {
					let destination = new TroopDestination(
						cells.Get(coordinate),
						this.GetRoad(troop.Tank.GetCurrentCell(), cells.Get(coordinate))
					);

					if (!troopRoads.Destinations.hasOwnProperty(danger)) {
						troopRoads.Destinations[danger] = new Array<TroopDestination>();
					}
					troopRoads.Destinations[danger].push(destination);
				});
			}
		});
		return allTroopRoads.filter((t) => Object.keys(t.Destinations).length > 0);
	}

	private GetRoad(departure: Cell, destination: Cell): Cell[] {
		const filter = (c: Cell) => !isNullOrUndefined(c) && !c.IsBlocked();
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(filter, cost).GetPath(departure, destination);
	}

	private GetFoeCells(areas: Area[], ally: Tank): Array<Cell> {
		const enemycells = new Array<Cell>();
		areas.forEach((area) => {
			area.GetFoeCells(ally).forEach((enemycell) => {
				enemycells.push(enemycell);
			});
		});
		return enemycells;
	}

	private ResolveConflicts(troops: Array<TroopRoads>, conflicts: Array<Cell>): void {
		troops.forEach((troop) => {
			troop.PotentialNextDestination = troop.GetBestDestination(conflicts);
		});

		var cost = Math.max.apply(
			Math,
			troops.map(function(o) {
				return o.GetPotentialCost();
			})
		);
		for (const troop of troops) {
			if (troop.GetPotentialCost() === cost) {
				troop.PotentialNextDestination = null;
				break;
			}
		}

		for (const troop of troops) {
			if (troop.PotentialNextDestination != null) {
				troop.CurrentDestination = troop.PotentialNextDestination;
			}
		}
	}

	private LogOrder(troopSituation: TroopRoads) {
		// console.log(
		// 	`%c tank get order to go to ${troopSituation.CurrentDestination.Destination.Coo()}`,
		// 	'font-weight:bold;color:red;'
		// );
	}

	private LogTroopCount() {
		// console.log(`%c [ALERT] troops count ${this.Area.GetTroops().length}`, 'font-weight:bold;color:red;');
	}
}
