import { ICell } from '../Items/Cell/ICell';

export class AStarNode<T extends ICell> {
	Cell: T;
	EstimatedGoalCost: number;
	FromStartCost: number;
	Parent: AStarNode<T>;

	constructor(cell: T) {
		this.Cell = cell;
	}

	IsLessCostly(compareToNode: AStarNode<T>): boolean {
		return this.GetCost() < compareToNode.GetCost();
	}

	GetEstimatedCost(nextNode: AStarNode<T>, fastestWay: boolean = false): number {
		const center = this.Cell.GetCentralPoint();
		const compareToCenter = nextNode.Cell.GetCentralPoint();
		const ratio = fastestWay ? nextNode.Cell.GetCostRatio() : 1;
		return this.Distance(compareToCenter, center) * ratio;
	}

	private Distance(compareToCenter: import("d:/workspace/program6/src/Core/Utils/Geometry/Point").Point, center: import("d:/workspace/program6/src/Core/Utils/Geometry/Point").Point): number {
		return (Math.sqrt(Math.pow(compareToCenter.X - center.X, 2)) + Math.sqrt(Math.pow(compareToCenter.Y - center.Y, 2)));
	}

	GetCost(): number {
		return this.EstimatedGoalCost + this.FromStartCost;
	}
}
