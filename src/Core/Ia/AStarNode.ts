import { IHex } from '../Utils/Geometry/IHex';

export class AStarNode<T extends IHex<T>> {
	Cell: T;
	EstimatedGoalCost: number;
	FromStartCost: number;
	Parent: AStarNode<T>;

	constructor(cell: T, private _cellCost: (cell: T) => number) {
		this.Cell = cell;
	}

	IsLessCostly(compareToNode: AStarNode<T>): boolean {
		return this.GetCost() < compareToNode.GetCost();
	}

	GetEstimatedCost(nextNode: AStarNode<T>, fastestWay: boolean = false): number {
		const ratio = fastestWay ? this._cellCost(this.Cell) : 1;
		return this.Cell.GetDistance(nextNode.Cell) * ratio;
	}

	GetCost(): number {
		return this.EstimatedGoalCost + this.FromStartCost;
	}
}
