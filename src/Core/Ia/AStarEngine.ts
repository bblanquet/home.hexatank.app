import { GameSettings } from '../Framework/GameSettings';
import { AStarNode } from './AStarNode';
import { ICell } from '../Items/Cell/ICell';

export class AStarEngine<T extends ICell> {
	constructor(private _cellFilter: (cell: T) => boolean, private _cellCost: (cell: T) => number) {}

	private ConstructPath(node: AStarNode<T>): Array<T> {
		var cells = new Array<T>();
		while (node.Parent != null) {
			cells.splice(0, 0, node.Cell);
			node = node.Parent;
		}

		return cells;
	}

	private Contains(nodes: Array<AStarNode<T>>, cell: T): boolean {
		for (let node of nodes) {
			if (node.Cell == cell) {
				return true;
			}
		}

		return false;
	}

	private GetNode(cell: T, candidates: Array<AStarNode<T>>, path: Array<AStarNode<T>>): AStarNode<T> {
		for (let candidate of candidates) {
			if (candidate.Cell === cell) {
				return candidate;
			}
		}

		for (let pathItem of path) {
			if (pathItem.Cell === cell) {
				return pathItem;
			}
		}

		return new AStarNode(cell, this._cellCost);
	}

	private AddNodeIntoCandidates(candidates: Array<AStarNode<T>>, currentNode: AStarNode<T>): void {
		if (candidates.length === 0) {
			candidates.push(currentNode);
		} else {
			for (var i = 0; i < candidates.length; i++) {
				if (currentNode.IsLessCostly(candidates[i])) {
					candidates.splice(i, 0, currentNode);
					return;
				}
			}
			candidates.push(currentNode);
		}
	}

	public GetPath(startcell: T, goalcell: T, fastestWay: boolean = false): Array<T> {
		var candidates = new Array<AStarNode<T>>();
		var path = new Array<AStarNode<T>>();

		var start = new AStarNode(startcell, this._cellCost);
		var goal = new AStarNode(goalcell, this._cellCost);

		start.FromStartCost = 0;
		start.Parent = null;
		start.EstimatedGoalCost = start.GetEstimatedCost(goal);

		this.AddNodeIntoCandidates(candidates, start);

		while (this.IsNotEmpty(candidates)) {
			if (GameSettings.MapSize * 4 < path.length) {
				//console.log(`%c COULD NOT FIND ,opened nodes: ${candidates.length}`, 'color:purple;');
				return null;
			}

			const bestCandidate = this.PopLessCostlyCandidate(candidates);

			if (bestCandidate.Cell == goal.Cell) {
				return this.ConstructPath(bestCandidate);
			}

			bestCandidate.Cell.GetFilteredNeighbourhood(this._cellFilter).forEach((nextCell) => {
				const nextNode = this.GetNode(<T>nextCell, candidates, path);
				const moveToNextCost =
					bestCandidate.FromStartCost + bestCandidate.GetEstimatedCost(nextNode, fastestWay);

				if (this.IsNew(nextNode.Cell, candidates, path) || moveToNextCost < nextNode.FromStartCost) {
					nextNode.Parent = bestCandidate;
					nextNode.FromStartCost = moveToNextCost;
					nextNode.EstimatedGoalCost = nextNode.GetEstimatedCost(goal);

					if (this.Contains(path, nextNode.Cell)) {
						path.splice(path.indexOf(nextNode), 1); //remove next node from path
					}

					if (!this.Contains(candidates, nextNode.Cell)) {
						this.AddNodeIntoCandidates(candidates, nextNode);
					}
				}
			});
			path.push(bestCandidate);
		}
		//console.log(`%c COULD NOT FIND ,opened nodes: ${candidates.length}`, 'color:purple;');
		return null;
	}

	private IsNotEmpty(frontierNodes: AStarNode<T>[]) {
		return 0 < frontierNodes.length;
	}

	private PopLessCostlyCandidate(candidates: Array<AStarNode<T>>): AStarNode<T> {
		var currentNode = candidates[0];
		candidates.splice(0, 1);
		return currentNode;
	}

	private IsNew(cell: T, openedNodes: Array<AStarNode<T>>, closedNodes: Array<AStarNode<T>>): Boolean {
		var isOpenedNode = this.Contains(openedNodes, cell);
		var isClosedNode = this.Contains(closedNodes, cell);
		return !isOpenedNode && !isClosedNode;
	}
}
