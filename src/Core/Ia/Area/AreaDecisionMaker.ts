import { AreaEngine } from './AreaEngine';
import { CellContext } from './../../Items/Cell/CellContext';
import { HeldArea } from './HeldArea';
import { Cell } from '../../Items/Cell/Cell';
import { isNullOrUndefined } from 'util';
import { TroopSituation } from './TroopSituation';
import { TroopDestination } from './TroopDestination';
import { Area } from './Area';
import { SimpleOrder } from '../Order/SimpleOrder';
import { GameHelper } from '../../Framework/GameHelper';
import { Tank } from '../../Items/Unit/Tank';
import { AStarEngine } from '../AStarEngine';

export class AreaDecisionMaker {
	constructor(private _area: HeldArea, private _cells: CellContext<Cell>) {}

	public Update(): void {
		this.Do();
	}

	private Do(): void {
		if (this._area.GetTroops().length > 0) {
			console.log(`%c [ALERT] troops count ${this._area.GetTroops().length}`, 'font-weight:bold;color:red;');
			const ally = this._area.GetTroops()[0].Tank;

			console.log(`%c troops count ${this._area.GetTroops().length}`, 'font-weight:bold;color:green;');

			//#1 get in & out cells
			const areas = new AreaEngine<Cell>()
				.GetIncludedFirstRange(this._cells, this._area.GetCentralCell())
				.map((c) => new Area(c));

			//#2 get enemies cells
			const enemycells = this.GetEnemycells(areas, ally);

			console.log(`%c enemy cells count ${enemycells.length}`, 'font-weight:bold;color:blue;');

			//#3 get enemy contact cells
			const surroundingEnemycells = this.GetSurroundingEnemycells(enemycells);

			console.log(
				`%c surrounding enemy cells count ${Object.keys(surroundingEnemycells).length}`,
				'font-weight:bold;color:red;'
			);

			//#4 classify cell dangerous
			const dangerLevelcells = this.ClassifycellDanger(surroundingEnemycells, ally);

			for (let danger in dangerLevelcells) {
				console.log(
					`%c danger lvl ${danger} - cells count ${Object.keys(dangerLevelcells[danger]).length}`,
					'font-weight:bold;color:brown;'
				);
			}

			//#5 find path to reach cells and classify them
			let troopSituations = new Array<TroopSituation>();
			this.FindTroopPaths(troopSituations, dangerLevelcells);

			troopSituations = troopSituations.filter((t) => Object.keys(t.Destinations).length > 0);

			//#6 select path
			const currentDestTroops = this.SelectBestPaths(troopSituations);

			if (isNullOrUndefined(currentDestTroops)) {
				return;
			}

			//#7 give orders to units
			for (let key in currentDestTroops) {
				currentDestTroops[key].forEach((troopSituation) => {
					console.log(
						`%c tank get order to go to ${troopSituation.CurrentDestination.Destination
							.GetCoordinate()
							.ToString()}`,
						'font-weight:bold;color:red;'
					);
					troopSituation.Troop.Tank.SetOrder(
						new SimpleOrder(troopSituation.CurrentDestination.Destination, troopSituation.Troop.Tank)
					);
				});
			}
		}
	}

	private GetSurroundingEnemycells(enemycells: Array<Cell>) {
		const enemyContactcells: { [id: string]: Cell } = {};
		enemycells.forEach((enemycell) => {
			enemycell.GetNeighbourhood().forEach((cell) => {
				if (!enemyContactcells.hasOwnProperty(cell.GetCoordinate().ToString())) {
					enemyContactcells[cell.GetCoordinate().ToString()] = cell as Cell;
				}
			});
		});
		return enemyContactcells;
	}

	private ClassifycellDanger(
		enemySurroundingcells: { [id: string]: Cell },
		ally: Tank
	): { [id: number]: { [id: string]: Cell } } {
		var dangerLevelcells: { [id: number]: { [id: string]: Cell } } = {};

		for (let key in enemySurroundingcells) {
			const currentcell = enemySurroundingcells[key];
			const cellKey = currentcell.GetCoordinate().ToString();
			const dangerLevel = currentcell
				.GetAllNeighbourhood()
				.map((c) => c as Cell)
				.filter((c) => !isNullOrUndefined(c) && c.HasEnemy(ally)).length;

			if (!dangerLevelcells.hasOwnProperty(dangerLevel)) {
				dangerLevelcells[dangerLevel] = {};
			}

			if (!dangerLevelcells[dangerLevel].hasOwnProperty(cellKey)) {
				dangerLevelcells[dangerLevel][cellKey] = currentcell;
			}
		}
		return dangerLevelcells;
	}

	private SelectBestPaths(troopSituations: TroopSituation[]): { [cellKey: string]: TroopSituation[] } {
		this.SetTroopDestination(troopSituations);
		let unresolvedCases = 0;
		var hasConflicts = true;
		const excludedcells: { [id: string]: Cell } = {};
		while (hasConflicts) {
			if (unresolvedCases === 4) {
				return null;
			}

			unresolvedCases++;
			hasConflicts = false;
			var troopsByDest = this.GetTroopsByDest(troopSituations);
			for (const dest in troopsByDest) {
				if (troopsByDest[dest].length > 1) {
					excludedcells[dest] = troopsByDest[dest][0].CurrentDestination.Destination;

					let cells = new Array<Cell>();
					for (var prop in excludedcells) {
						cells.push(excludedcells[prop]);
					}

					this.ResolveConflicts(troopsByDest[dest], cells);
				}
			}
			troopsByDest = this.GetTroopsByDest(troopSituations);
			for (const dest in troopsByDest) {
				if (troopsByDest[dest].length > 1) {
					hasConflicts = true;
				}
			}
		}

		return troopsByDest;
	}

	private SetTroopDestination(troopSituations: TroopSituation[]): void {
		troopSituations.forEach((troopSituation) => {
			troopSituation.CurrentDestination = troopSituation.GetClosestAndSafestPath();
		});
	}

	private GetTroopsByDest(troopSituations: TroopSituation[]): { [cellKey: string]: TroopSituation[] } {
		var currentDestTroops: { [cellKey: string]: TroopSituation[] } = {};

		troopSituations.forEach((troopSituation) => {
			const key = troopSituation.CurrentDestination.Destination.GetCoordinate().ToString();
			if (!currentDestTroops.hasOwnProperty(key)) {
				currentDestTroops[key] = new Array<TroopSituation>();
			}
			currentDestTroops[key].push(troopSituation);
		});
		return currentDestTroops;
	}

	private FindTroopPaths(
		troopSituations: TroopSituation[],
		dangerLevelcells: { [id: number]: { [id: string]: Cell } }
	) {
		this._area.GetTroops().forEach((troop) => {
			const troopSituation = new TroopSituation();
			troopSituation.Troop = troop;
			troopSituations.push(troopSituation);

			for (let danger in dangerLevelcells) {
				for (let cellKey in dangerLevelcells[danger]) {
					var destination = new TroopDestination(
						dangerLevelcells[danger][cellKey],
						new AStarEngine<Cell>().GetPath(troop.Tank.GetCurrentCell(), dangerLevelcells[danger][cellKey])
					);

					if (!troopSituation.Destinations.hasOwnProperty(danger)) {
						troopSituation.Destinations[danger] = new Array<TroopDestination>();
					}
					troopSituation.Destinations[danger].push(destination);
				}
			}
		});
	}

	private GetEnemycells(areas: Area[], ally: Tank): Array<Cell> {
		const enemycells = new Array<Cell>();
		areas.forEach((area) => {
			area.GetEnemycell(ally).forEach((enemycell) => {
				enemycells.push(enemycell);
			});
		});
		return enemycells;
	}

	private ResolveConflicts(troops: Array<TroopSituation>, conflicts: Array<Cell>): void {
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
}
