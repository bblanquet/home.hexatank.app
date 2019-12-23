import {ICell} from '../Cell/ICell';

export class AStarNode<T extends ICell>{
    Cell:T;      
    EstimatedGoalCost:number;
    FromStartCost:number;
    Parent:AStarNode<T>;

    constructor(cell:T){
       this.Cell = cell; 
    }

    IsLessExpensive(compareToNode:AStarNode<T>):boolean{
        return this.GetCost() < compareToNode.GetCost();
    }

    GetEstimatedCost(node:AStarNode<T>):number
    {
        var center = this.Cell.GetCentralPoint();
        var compareToCenter = node.Cell.GetCentralPoint();

        return Math.sqrt(Math.pow(compareToCenter.X - center.X,2)) 
            + Math.sqrt(Math.pow(compareToCenter.Y - center.Y,2));
    }

    GetCost():number{
        return this.EstimatedGoalCost+this.FromStartCost;
    }
}