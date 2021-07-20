import { ISimpleRequestHandler } from './../ISimpleRequestHandler';
import { AreaRequest } from '../../Utils/AreaRequest';
import { RequestType } from '../../Utils/RequestType';
import { Dictionary } from '../../../../../Utils/Collections/Dictionary';
import { Groups } from '../../../../../Utils/Collections/Groups';
import { LogKind } from '../../../../../Utils/Logger/LogKind';
import { StaticLogger } from '../../../../../Utils/Logger/StaticLogger';
import { Cell } from '../../../../Items/Cell/Cell';
import { TypeTranslator } from '../../../../Items/Cell/Field/TypeTranslator';
import { Tank } from '../../../../Items/Unit/Tank';
import { AStarEngine } from '../../../AStarEngine';
import { AStarHelper } from '../../../AStarHelper';
import { MonitoredOrder } from '../../../Order/MonitoredOrder';
import { Area } from '../../Utils/Area';
import { IaArea } from '../../Utils/IaArea';
import { TroopRoads } from '../../Troop/TroopRoads';
import { TroopDestination } from '../../Utils/TroopDestination';
import { isNullOrUndefined } from '../../../../../Utils/ToolBox';

export class DefenseHandler implements ISimpleRequestHandler {
	Handle(request: AreaRequest): void {
		const area = request.Area;
		if (0 < area.GetTroops().length) {
			const ally = area.GetTroops()[0];

			//#1 get in & out cells
			const areas = this.GetAround(area.GetSpot());

			//#2 get enemies cells
			const foeCells = this.GetFoeVehicleCells(areas, ally);

			this.SendTroops(area, foeCells, ally);
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

	private SendTroops(area: IaArea, foeCells: Cell[], ally: Tank) {
		//#3 get enemy contact cells
		const aroundFoeCells = this.GetAroundFoeCells(foeCells);

		StaticLogger.Log(LogKind.info, `[FREE FOE CELL] ${Object.keys(aroundFoeCells).length}`);

		//#4 classify cell dangerous
		const cellsByDanger = this.ClassifyCellDanger(aroundFoeCells, ally);

		//#5 find path to reach cells and classify them
		const troopRoads = this.GetTroopRoads(area, cellsByDanger);

		//#6 select path
		const bestTroopRoads = this.FindBestRoads(troopRoads);

		//#7 give orders to units
		if (!isNullOrUndefined(bestTroopRoads)) {
			bestTroopRoads.Keys().forEach((coordinate) => {
				bestTroopRoads.Get(coordinate).forEach((troopSituation) => {
					this.LogOrder(troopSituation);
					troopSituation.Tank.GiveOrder(
						new MonitoredOrder(troopSituation.CurrentDestination.Destination, troopSituation.Tank)
					);
				});
			});
		}
	}

	private GetAroundFoeCells(enemycells: Array<Cell>): Dictionary<Cell> {
		const enemyContactcells = new Dictionary<Cell>();
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

	private ClassifyCellDanger(aroundFoeCells: Dictionary<Cell>, ally: Tank): { [danger: number]: Dictionary<Cell> } {
		var dangerLevelcells: { [danger: number]: Dictionary<Cell> } = {};

		aroundFoeCells.Keys().forEach((key) => {
			const currentcell = aroundFoeCells.Get(key);
			const coordinate = currentcell.Coo();
			const dangerLevel = this.GetAroundCellFoes(currentcell, ally);

			if (!dangerLevelcells.hasOwnProperty(dangerLevel)) {
				dangerLevelcells[dangerLevel] = new Dictionary<Cell>();
			}

			if (!dangerLevelcells[dangerLevel].hasOwnProperty(coordinate)) {
				dangerLevelcells[dangerLevel].Add(coordinate, currentcell);
			}
		});
		return dangerLevelcells;
	}

	private GetAroundCellFoes(currentcell: Cell, tank: Tank) {
		return currentcell
			.GetNearby()
			.map((c) => c as Cell)
			.filter((c) => c && TypeTranslator.HasFoeVehicle(c, tank.Identity)).length;
	}

	private FindBestRoads(troopRoads: TroopRoads[]): Groups<TroopRoads> {
		this.SetTroopDestination(troopRoads);
		let unresolvedCases = 0;
		var hasConflicts = true;
		const excludedcells = new Dictionary<Cell>();
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

	private GetTroopRoads(area: IaArea, cellsByDanger: { [id: number]: Dictionary<Cell> }): Array<TroopRoads> {
		let allTroopRoads = new Array<TroopRoads>();

		area.GetTroops().filter((t) => !t.IsCloseFromEnemy()).forEach((troop) => {
			const troopRoads = new TroopRoads();
			troopRoads.Tank = troop;
			allTroopRoads.push(troopRoads);

			for (let danger in cellsByDanger) {
				const cells = cellsByDanger[danger];
				cells.Keys().forEach((coordinate) => {
					let destination = new TroopDestination(
						cells.Get(coordinate),
						this.GetRoad(troop.GetCurrentCell(), cells.Get(coordinate))
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

	private GetFoeVehicleCells(areas: Area[], ally: Tank): Array<Cell> {
		const enemycells = new Array<Cell>();
		areas.forEach((area) => {
			area.GetVehicleFoeCells(ally.Identity).forEach((enemycell) => {
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
		StaticLogger.Log(
			LogKind.info,
			`tank get order to go to ${troopSituation.CurrentDestination.Destination.Coo()}`
		);
	}

	Type(): RequestType {
		return RequestType.Defense;
	}
}
