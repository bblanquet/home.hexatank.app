import {ICeil} from '../Ceils/ICeil';

export class AStarNode<T extends ICeil>{
    Ceil:T;      
    EstimatedGoalCost:number;
    FromStartCost:number;
    Parent:AStarNode<T>;

    constructor(ceil:T){
       this.Ceil = ceil; 
    }

    IsLessExpensive(compareToNode:AStarNode<T>):boolean{
        return this.GetCost() < compareToNode.GetCost();
    }

    GetEstimatedCost(node:AStarNode<T>):number
    {
        var center = this.Ceil.GetCentralPoint();
        var compareToCenter = node.Ceil.GetCentralPoint();

        return Math.sqrt(Math.pow(compareToCenter.X - center.X,2)) 
            + Math.sqrt(Math.pow(compareToCenter.Y - center.Y,2));
    }

    GetCost():number{
        return this.EstimatedGoalCost+this.FromStartCost;
    }
}