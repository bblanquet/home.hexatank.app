import { GameSettings } from '../Framework/GameSettings';
import { AStarNode } from './AStarNode';
import { ICell } from '../Items/Cell/ICell';

export class AStarEngine<T extends ICell> {
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

	private GetNode(cell: T, frontierNodes: Array<AStarNode<T>>, cameFromNodes: Array<AStarNode<T>>): AStarNode<T> {
		for (let frontierNode of frontierNodes) {
			if (frontierNode.Cell === cell) {
				return frontierNode;
			}
		}

		for (let cameFromNode of cameFromNodes) {
			if (cameFromNode.Cell === cell) {
				return cameFromNode;
			}
		}

		return new AStarNode(cell);
	}

	private InsertByCost(nodes: Array<AStarNode<T>>, node: AStarNode<T>): void {
		if (nodes.length == 0) {
			nodes.push(node);
			return;
		}

		for (var i = 0; i < nodes.length; i++) {
			if (node.IsLessExpensive(nodes[i])) {
				nodes.splice(i, 0, node);
				return;
			}
		}

		nodes.push(node);
	}

	//console.log(`%c start: ${startcell.GetCoordinate().Q} ${startcell.GetCoordinate().R} `,'color:green;');
	//console.log(`%c goal: ${goalcell.GetCoordinate().Q} ${goalcell.GetCoordinate().R} `,'color:green;');

	public GetPath(startcell: T, goalcell: T): Array<T> {
		var frontierNodes = new Array<AStarNode<T>>();
		var cameFromNodes = new Array<AStarNode<T>>();

		var startnode = new AStarNode(startcell);
		var goalnode = new AStarNode(goalcell);

		startnode.FromStartCost = 0;
		startnode.Parent = null;
		startnode.EstimatedGoalCost = startnode.GetEstimatedCost(goalnode);

		this.InsertByCost(frontierNodes, startnode);

		while (this.IsNotEmpty(frontierNodes)) {
			if (GameSettings.MapSize < cameFromNodes.length) {
				console.log(`%c COULD NOT FIND ,opened nodes: ${frontierNodes.length}`, 'color:purple;');
				return null;
			}

			const lessExpensiveFrontier = this.GetLessExpensiveFrontier(frontierNodes);

			if (lessExpensiveFrontier.Cell == goalnode.Cell) {
				return this.ConstructPath(lessExpensiveFrontier);
			}

			lessExpensiveFrontier.Cell.GetNeighbourhood().forEach((frontierSurrounding) => {
				const nextNode = this.GetNode(<T>frontierSurrounding, frontierNodes, cameFromNodes);

				const estimatedNextNodeCost =
					lessExpensiveFrontier.FromStartCost + lessExpensiveFrontier.GetEstimatedCost(nextNode);

				if (
					this.IsNodeNew(<T>frontierSurrounding, frontierNodes, cameFromNodes) ||
					estimatedNextNodeCost < nextNode.FromStartCost
				) {
					nextNode.Parent = lessExpensiveFrontier;
					nextNode.FromStartCost = estimatedNextNodeCost;
					nextNode.EstimatedGoalCost = nextNode.GetEstimatedCost(goalnode);

					if (this.Contains(cameFromNodes, <T>frontierSurrounding)) {
						cameFromNodes.splice(cameFromNodes.indexOf(nextNode), 1);
					}

					if (!this.Contains(frontierNodes, <T>frontierSurrounding)) {
						this.InsertByCost(frontierNodes, nextNode);
					}
				}
			});
			cameFromNodes.push(lessExpensiveFrontier);
		}
		console.log(`%c COULD NOT FIND ,opened nodes: ${frontierNodes.length}`, 'color:purple;');
		return null;
	}

	private IsNotEmpty(frontierNodes: AStarNode<T>[]) {
		return 0 < frontierNodes.length;
	}

	//console.log(`%c opened nodes: ${openedNodes.length} `,'font-weight:bold;color:red;');
	//console.log(`%c closed nodes: ${closedNodes.length} `,'font-weight:bold;color:red;');
	//console.log(`%c current: ${currentNode.cell.GetCoordinate().Q} ${currentNode.cell.GetCoordinate().R} cost:${currentNode.GetCost()}`,'color:blue;');
	//console.log(`%c next: ${cell.GetCoordinate().Q} ${cell.GetCoordinate().R} cost:${nextNode.GetCost()} ,opened nodes: ${openedNodes.length}`,'color:purple;');

	private GetLessExpensiveFrontier(openedNodes: Array<AStarNode<T>>): AStarNode<T> {
		var currentNode = openedNodes[0];
		openedNodes.splice(0, 1);
		return currentNode;
	}

	private IsNodeNew(cell: T, openedNodes: Array<AStarNode<T>>, closedNodes: Array<AStarNode<T>>): Boolean {
		var isOpenedNode = this.Contains(openedNodes, cell);
		var isClosedNode = this.Contains(closedNodes, cell);
		return !isOpenedNode && !isClosedNode;
	}
}
