import { ICell } from '../Items/Cell/ICell';
import { Point } from '../Utils/Geometry/Point';

export class AStarNode<T extends ICell> {
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
		const center = this.Cell.GetCentralPoint();
		const compareToCenter = nextNode.Cell.GetCentralPoint();
		const ratio = fastestWay ? this._cellCost(this.Cell) : 1;
		return this.Distance(compareToCenter, center) * ratio;
	}

	private Distance(compareToCenter: Point, center: Point): number {
		return (
			Math.sqrt(Math.pow(compareToCenter.X - center.X, 2)) + Math.sqrt(Math.pow(compareToCenter.Y - center.Y, 2))
		);
	}

	GetCost(): number {
		return this.EstimatedGoalCost + this.FromStartCost;
	}
}
