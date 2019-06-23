import {AStarNode} from './AStarNode';
import {ICeil} from './Ceils/ICeil';
import { PlaygroundHelper } from './PlaygroundHelper';

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
        for (let node of nodes)
        {
            if(node.Ceil == ceil)
            {
                return true;
            }
        }

        return false;
    }

    private GetNode(ceil:T, 
        frontierNodes:Array<AStarNode<T>>,
        cameFromNodes:Array<AStarNode<T>>):AStarNode<T>
    {
        for (let frontierNode of frontierNodes)
        {
            if(frontierNode.Ceil === ceil)
            {
                return frontierNode;
            }
        }

        
        for( let cameFromNode of cameFromNodes)
        {
            if(cameFromNode.Ceil === ceil)
            {
                return cameFromNode;
            }
        }
        

        return new AStarNode(ceil);
    }

    private InsertByCost(nodes:Array<AStarNode<T>>,node:AStarNode<T>):void
    {
        if(nodes.length == 0)
        {
            nodes.push(node);
            return;
        }

        for(var i =0; i < nodes.length; i++){
            if(node.IsLessExpensive(nodes[i]))
            {
                nodes.splice(i,0,node);
                return;
            }
        }

        nodes.push(node);
    }

        //console.log(`%c start: ${startCeil.GetCoordinate().Q} ${startCeil.GetCoordinate().R} `,'color:green;');
        //console.log(`%c goal: ${goalCeil.GetCoordinate().Q} ${goalCeil.GetCoordinate().R} `,'color:green;');

    public GetPath(startCeil:T, goalCeil:T):Array<T>
    {
        var frontierNodes = new Array<AStarNode<T>>();
        var cameFromNodes = new Array<AStarNode<T>>();

        var startnode = new AStarNode(startCeil);
        var goalnode = new AStarNode(goalCeil);

        startnode.FromStartCost = 0;
        startnode.Parent = null;
        startnode.EstimatedGoalCost = startnode.GetEstimatedCost(goalnode);

        this.InsertByCost(frontierNodes,startnode);

        while(this.IsNotEmpty(frontierNodes))
        {
            if(PlaygroundHelper.Settings.MapSize < cameFromNodes.length)
            {
                console.log(`%c COULD NOT FIND ,opened nodes: ${frontierNodes.length}`,'color:purple;');
                return null;
            }

            const lessExpensiveFrontier = this.GetLessExpensiveFrontier(frontierNodes);

            if(lessExpensiveFrontier.Ceil == goalnode.Ceil)
            {
                return this.ConstructPath(lessExpensiveFrontier);
            }

            lessExpensiveFrontier.Ceil.GetNeighbourhood().forEach(frontierSurrounding=> 
            {
                const nextNode = this.GetNode(<T> frontierSurrounding, frontierNodes, cameFromNodes);
                
                const estimatedNextNodeCost = lessExpensiveFrontier.FromStartCost 
                + lessExpensiveFrontier.GetEstimatedCost(nextNode);

                if(this.IsNodeNew(<T>frontierSurrounding,frontierNodes,cameFromNodes) 
                    || estimatedNextNodeCost < nextNode.FromStartCost)
                {
                    nextNode.Parent = lessExpensiveFrontier;
                    nextNode.FromStartCost = estimatedNextNodeCost;
                    nextNode.EstimatedGoalCost = nextNode.GetEstimatedCost(goalnode);

                    if(this.Contains(cameFromNodes,<T>frontierSurrounding))
                    {
                        cameFromNodes.splice(cameFromNodes.indexOf(nextNode),1);
                    }

                    if(!this.Contains(frontierNodes,<T>frontierSurrounding))
                    {
                        this.InsertByCost(frontierNodes,nextNode);
                    }
                }
            });
            cameFromNodes.push(lessExpensiveFrontier);
        }
        console.log(`%c COULD NOT FIND ,opened nodes: ${frontierNodes.length}`,'color:purple;');
        return null;
    }

    private IsNotEmpty(frontierNodes: AStarNode<T>[]) {
        return 0 < frontierNodes.length;
    }

                //console.log(`%c opened nodes: ${openedNodes.length} `,'font-weight:bold;color:red;');
            //console.log(`%c closed nodes: ${closedNodes.length} `,'font-weight:bold;color:red;');
            //console.log(`%c current: ${currentNode.Ceil.GetCoordinate().Q} ${currentNode.Ceil.GetCoordinate().R} cost:${currentNode.GetCost()}`,'color:blue;');
                    //console.log(`%c next: ${ceil.GetCoordinate().Q} ${ceil.GetCoordinate().R} cost:${nextNode.GetCost()} ,opened nodes: ${openedNodes.length}`,'color:purple;');


    private GetLessExpensiveFrontier(openedNodes:Array<AStarNode<T>>):AStarNode<T>{
        var currentNode = openedNodes[0];
        openedNodes.splice(0,1);
        return currentNode;
    }

    private IsNodeNew(ceil:T, 
        openedNodes:Array<AStarNode<T>>,
         closedNodes:Array<AStarNode<T>>)
         :Boolean
    {
        var isOpenedNode = this.Contains(openedNodes,ceil);
        var isClosedNode = this.Contains(closedNodes,ceil);
        return (!isOpenedNode && !isClosedNode);
    }
}