import { Dictionnary } from './../../../Utils/Collections/Dictionnary';
import { TroopSituation } from './../Troop/TroopSituation';
import { KingdomArea } from '../Utils/KingdomArea';
import { CellContext } from '../../../Items/Cell/CellContext';
import { Cell } from '../../../Items/Cell/Cell';
import { Area } from '../Utils/Area';
import { isNullOrUndefined } from 'util';
import { SimpleOrder } from '../../Order/SimpleOrder';
import { Tank } from '../../../Items/Unit/Tank';
import { Groups } from '../../../Utils/Collections/Groups';
import { TroopDestination } from '../Utils/TroopDestination';
import { AreaSearch } from '../Utils/AreaSearch';
import { AStarEngine } from '../../AStarEngine';

export class BasicAreaDecisionMaker {
	private _areaSearch: AreaSearch;
	public HasReceivedRequest: boolean;

	constructor(public Area: KingdomArea, private _cells: CellContext<Cell>) {
		this._areaSearch = new AreaSearch(this._cells.Keys());
	}

	public Update(): void {
		this.Area.Troops = this.Area.Troops.filter((t) => t.Tank.IsAlive());

		if (1 < this.Area.Troops.length) {
			this.LogPosition();
		}

		if (0 < this.Area.GetFoesCount()) {
			this.Do();
		} else {
			this.Area.Troops.forEach((troop) => {
				troop.Update();
			});
		}
	}

	private Do(): void {
		if (0 < this.Area.GetTroops().length) {
			this.LogTroopCount();
			const ally = this.Area.GetTroops()[0].Tank;

			//#1 get in & out cells
			const areas = this._areaSearch
				.GetIncludedFirstRange(this.Area.GetCentralCell().GetCoordinate())
				.map((coo) => new Area(this._cells.Get(coo), this._cells));

			//#2 get enemies cells
			const foeCells = this.GetFoeCells(areas, ally);

			console.log(`%c [DETECTED FOE] ${foeCells.length}`, 'font-weight:bold;color:blue;');

			//#3 get enemy contact cells
			const aroundFoeCells = this.GetAroundFoeCells(foeCells);

			console.log(`%c [FREE FOE CELL] ${Object.keys(aroundFoeCells).length}`, 'font-weight:bold;color:red;');

			//#4 classify cell dangerous
			const cellsByDanger = this.ClassifyCellDanger(aroundFoeCells, ally);

			for (let danger in cellsByDanger) {
				this.LogDanger(danger, cellsByDanger);
			}

			//#5 find path to reach cells and classify them
			let troopSituations = this.FindTroopPaths(cellsByDanger);

			//#6 select path
			const destTroops = this.SelectBestPaths(troopSituations);

			if (isNullOrUndefined(destTroops)) {
				return;
			}

			//#7 give orders to units
			destTroops.Keys().forEach((dest) => {
				destTroops.Get(dest).forEach((troopSituation) => {
					this.LogOrder(troopSituation);
					troopSituation.Troop.Tank.SetOrder(
						new SimpleOrder(troopSituation.CurrentDestination.Destination, troopSituation.Troop.Tank)
					);
				});
			});
		}
	}

	private GetAroundFoeCells(enemycells: Array<Cell>): Dictionnary<Cell> {
		const enemyContactcells = new Dictionnary<Cell>();
		enemycells.forEach((enemycell) => {
			enemycell.GetNeighbourhood().forEach((cell) => {
				let coo = cell.GetCoordinate().ToString();
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
			const coordinate = currentcell.GetCoordinate().ToString();
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
		return currentcell
			.GetAllNeighbourhood()
			.map((c) => c as Cell)
			.filter((c) => !isNullOrUndefined(c) && c.HasEnemy(ally)).length;
	}

	private SelectBestPaths(troopSituations: TroopSituation[]): Groups<TroopSituation> {
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
			var destTroops = this.GetTroopsByDest(troopSituations);
			destTroops.Keys().forEach((dest) => {
				if (1 < destTroops.Get(dest).length) {
					excludedcells[dest] = destTroops.Get(dest)[0].CurrentDestination.Destination;

					let cells = new Array<Cell>();
					for (var prop in excludedcells) {
						cells.push(excludedcells[prop]);
					}

					this.ResolveConflicts(destTroops.Get(dest), cells);
				}
			});
			destTroops = this.GetTroopsByDest(troopSituations);
			destTroops.Keys().forEach((dest) => {
				if (1 < destTroops.Get(dest).length) {
					hasConflicts = true;
				}
			});
		}

		return destTroops;
	}

	private SetTroopDestination(troopSituations: TroopSituation[]): void {
		troopSituations.forEach((troopSituation) => {
			troopSituation.CurrentDestination = troopSituation.GetClosestAndSafestPath();
		});
	}

	private GetTroopsByDest(troopSituations: TroopSituation[]): Groups<TroopSituation> {
		var troopsByDest = new Groups<TroopSituation>();
		troopSituations.forEach((troopSituation) => {
			const key = troopSituation.CurrentDestination.Destination.GetCoordinate().ToString();
			troopsByDest.Add(key, troopSituation);
		});
		return troopsByDest;
	}

	private FindTroopPaths(cellsByDanger: { [id: number]: Dictionnary<Cell> }): Array<TroopSituation> {
		let troopSituations = new Array<TroopSituation>();

		this.Area.GetTroops().forEach((troop) => {
			const troopSituation = new TroopSituation();
			troopSituation.Troop = troop;
			troopSituations.push(troopSituation);

			for (let danger in cellsByDanger) {
				const cells = cellsByDanger[danger];
				for (let coordinate in cells.Keys()) {
					let destination = new TroopDestination(
						cells.Get(coordinate),
						this.GetRoad(troop.Tank.GetCurrentCell(), cells.Get(coordinate))
					);

					if (!troopSituation.Destinations.hasOwnProperty(danger)) {
						troopSituation.Destinations[danger] = new Array<TroopDestination>();
					}
					troopSituation.Destinations[danger].push(destination);
				}
			}
		});
		return troopSituations.filter((t) => Object.keys(t.Destinations).length > 0);
	}

	private GetRoad(departure: Cell, destination: Cell): Cell[] {
		return new AStarEngine<Cell>((c: Cell) => !isNullOrUndefined(c) && !c.IsBlocked()).GetPath(
			departure,
			destination
		);
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

	private LogOrder(troopSituation: TroopSituation) {
		console.log(
			`%c tank get order to go to ${troopSituation.CurrentDestination.Destination.GetCoordinate().ToString()}`,
			'font-weight:bold;color:red;'
		);
	}

	private LogDanger(danger: string, dangerLevelcells: { [id: number]: Dictionnary<Cell> }) {
		console.log(
			`%c danger lvl ${danger} - cells count ${Object.keys(dangerLevelcells[+danger]).length}`,
			'font-weight:bold;color:brown;'
		);
	}

	private LogPosition() {
		console.log(
			`%c AREA  ${this.Area.Troops.length} -> ${this.Area.GetCentralCell().GetCoordinate().ToString()}`,
			'font-weight:bold;'
		);
	}

	private LogTroopCount() {
		console.log(`%c [ALERT] troops count ${this.Area.GetTroops().length}`, 'font-weight:bold;color:red;');
	}
}
