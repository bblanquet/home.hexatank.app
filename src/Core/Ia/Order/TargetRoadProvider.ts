import { Cell } from '../../Items/Cell/Cell';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';
import { WaterField } from '../../Items/Cell/Field/WaterField';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { AStarEngine } from '../AStarEngine';
import { AStarHelper } from '../AStarHelper';

export class TargetRoad {
	constructor(public Target: Cell, public Road: Cell[]) {}
}

export class TargetRoadProvider {
	constructor(protected Tank: Vehicle, protected Destination: Cell) {}

	private IsAround() {
		return this.Tank.GetCurrentCell().GetAllNeighbourhood().some((c) => c === this.Destination);
	}

	public GetTargetRoad(): TargetRoad {
		if (this.IsAround() && !TypeTranslator.IsAccessible(this.Destination, this.Tank.Identity)) {
			return new TargetRoad(this.Destination, []);
		}

		let result: TargetRoad = null;
		const sortLimitlessRoad = this.SortLimitlessRoad();
		sortLimitlessRoad.some((candidate) => {
			let road = this.GetRoad(candidate);
			if (road) {
				result = new TargetRoad(candidate, road);
				return true;
			} else {
				const around = candidate.GetAllNeighbourhood(1);
				const candidateRoads = around.map((n) => this.GetRoad(n)).filter((n) => n);
				if (0 < candidateRoads.length) {
					const shortest = Math.min(...candidateRoads.map((c) => c.length));
					const bestRoad = candidateRoads.find((r) => r.length === shortest);
					result = new TargetRoad(candidate, bestRoad);
					return true;
				}
			}
			return false;
		});
		return result;
	}

	private GetRoad(cell: Cell) {
		const filter = (c: Cell) => c && TypeTranslator.IsAccessible(c, this.Tank.Identity);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(filter, cost).GetPath(this.Tank.GetCurrentCell(), cell, true);
	}

	private LimitlessRoad(): Cell[] {
		const limitless = (c: Cell) => c && !(c.GetField() instanceof WaterField);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(limitless, cost).GetPath(this.Tank.GetCurrentCell(), this.Destination, true);
	}

	private SortLimitlessRoad(): Cell[] {
		const sortLimitlessRoad = new Array<Cell>();
		const limitlessPath = this.LimitlessRoad();
		for (let index = limitlessPath.length - 1; -1 < index; index--) {
			sortLimitlessRoad.push(limitlessPath[index]);
		}
		return sortLimitlessRoad;
	}
}
