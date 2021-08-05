import { ErrorCat, ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';
import { Cell } from '../../Items/Cell/Cell';
import { TypeTranslator } from '../../Items/Cell/Field/TypeTranslator';
import { WaterField } from '../../Items/Cell/Field/WaterField';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { AStarEngine } from '../AStarEngine';
import { AStarHelper } from '../AStarHelper';

export class RoadProvider {
	constructor(protected Vehicle: Vehicle, protected Destination: Cell) {
		ErrorHandler.ThrowNullOrUndefined(Destination);
	}

	public GetBestRoad(): Cell[] {
		let road = new Array<Cell>();
		this.SortLimitlessRoad().some((candidate) => {
			const nextcells = this.GetRoad(candidate);
			if (nextcells) {
				road = nextcells;
				return true;
			}
			return false;
		});
		return road;
	}

	private GetRoad(candidate: Cell) {
		const filter = (c: Cell) => c && TypeTranslator.IsAccessible(c, this.Vehicle);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		const nextcells = new AStarEngine<Cell>(filter, cost).GetPath(this.Vehicle.GetCurrentCell(), candidate, true);
		return nextcells;
	}

	private LimitlessRoad(): Cell[] {
		const limitless = (c: Cell) => c && !(c.GetField() instanceof WaterField);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		return new AStarEngine<Cell>(limitless, cost).GetPath(this.Vehicle.GetCurrentCell(), this.Destination, true);
	}

	private SortLimitlessRoad(): Cell[] {
		//exception happened
		const sortLimitlessRoad = new Array<Cell>();
		const limitlessPath = this.LimitlessRoad();
		if (limitlessPath) {
			for (let index = limitlessPath.length - 1; -1 < index; index--) {
				sortLimitlessRoad.push(limitlessPath[index]);
			}
		}
		return sortLimitlessRoad;
	}
}
