import {AStarNode} from './AStarNode';
import {ICeil} from './ICeil';

export class AStarEngine<T extends ICeil>
{
    private ConstructPath(node:AStarNode<T>):Array<T>{
        var ceils = new Array<T>();
        while(node.Parent != null)
        {
            ceils.splice(0,0, node.Ceil);
            node = node.Parent;
        }

        return ceils;
    }    

    private Contains(nodes:Array<AStarNode<T>>, ceil:T):boolean
    {
        nodes.forEach(node => {
            if(node.Ceil == ceil){
                return true;
            }
        });

        return false;
    }

    private GetNode(ceil:T, 
        openedNodes:Array<AStarNode<T>>,
        closedNodes:Array<AStarNode<T>>):AStarNode<T>
    {
        openedNodes.forEach(node=>
            {
            if(node.Ceil === ceil)
            {
                return node;
            }
        });

        closedNodes.forEach(node=>
            {
            if(node.Ceil === ceil)
            {
                return node;
            }
        });

        return new AStarNode(ceil);
    }

    private Append(nodes:Array<AStarNode<T>>,node:AStarNode<T>):void
    {
        if(nodes.length == 0)
        {
            nodes.push(node);
            return;
        }

        for(var i =0; i < nodes.length; i++){
            if(node.Compare(nodes[i]))
            {
                nodes.splice(i,0,node);
                return;
            }
        }

        nodes.push(node);
    }

    public GetPath(startCeil:T, goalCeil:T):Array<T>{

        //console.log(`%c start: ${startCeil.GetCoordinate().Q} ${startCeil.GetCoordinate().R} `,'color:green;');
        //console.log(`%c goal: ${goalCeil.GetCoordinate().Q} ${goalCeil.GetCoordinate().R} `,'color:green;');

        var openedNodes = new Array<AStarNode<T>>();
        var closedNodes = new Array<AStarNode<T>>();

        var startnode = new AStarNode(startCeil);
        var goalnode = new AStarNode(goalCeil);

        startnode.FromStartCost = 0;
        startnode.Parent = null;
        startnode.EstimatedGoalCost = startnode.GetEstimatedCost(goalnode);

        this.Append(openedNodes,startnode);

        while(0 < openedNodes.length)
        {
            var currentNode = openedNodes[0];
            openedNodes.splice(0,1);

            //console.log(`%c opened nodes: ${openedNodes.length} `,'color:red;');
            //console.log(`%c closed nodes: ${closedNodes.length} `,'color:red;');
            //console.log(`%c current: ${currentNode.Ceil.GetCoordinate().Q} ${currentNode.Ceil.GetCoordinate().R} cost:${currentNode.GetCost()}`,'color:blue;');

            if(currentNode.Ceil == goalnode.Ceil)
            {
                return this.ConstructPath(currentNode);
            }

            var surroundingCeils = currentNode.Ceil.GetNeighbourhood();
            
            surroundingCeils.forEach(ceil=> {

                var nextNode = this.GetNode( <T> ceil, openedNodes, closedNodes);
                var estimatedNextNodeCost = currentNode.FromStartCost + currentNode.GetEstimatedCost(nextNode);

                var isOpenedNode = this.Contains(openedNodes,<T>ceil);
                var isClosedNode = this.Contains(closedNodes,<T>ceil);

                if(this.IsNewNode(<T>ceil,openedNodes,closedNodes) 
                    || 
                    estimatedNextNodeCost < nextNode.FromStartCost)
                {
                    nextNode.Parent = currentNode;
                    nextNode.FromStartCost = estimatedNextNodeCost;
                    nextNode.EstimatedGoalCost = nextNode.GetEstimatedCost(goalnode);
                    
                    //console.log(`%c next: ${ceil.GetCoordinate().Q} ${ceil.GetCoordinate().R} cost:${nextNode.GetCost()} ,opened nodes: ${openedNodes.length}`,'color:purple;');

                    if(isClosedNode)
                    {
                        closedNodes.splice(closedNodes.indexOf(nextNode),1);
                    }

                    if(!isOpenedNode)
                    {
                        this.Append(openedNodes,nextNode);
                    }
                }

            });
            closedNodes.push(currentNode);
        }

        return null;
    }

    private IsNewNode(ceil:T, 
        openedNodes:Array<AStarNode<T>>,
         closedNodes:Array<AStarNode<T>>)
         :Boolean
    {
        var isOpenedNode = this.Contains(openedNodes,ceil);
        var isClosedNode = this.Contains(closedNodes,ceil);
        return (!isOpenedNode && !isClosedNode);
    }
}