import {ICeil} from './ICeil';

export class AStarNode<T extends ICeil>{
    Ceil:T;    
    EstimatedGoalCost:number;
    FromStartCost:number;
    Parent:AStarNode<T>;

    constructor(ceil:T){
       this.Ceil = ceil; 
    }

    Compare(node:AStarNode<T>):boolean{
        return this.GetCost() < node.GetCost();
    }

    GetEstimatedCost(node:AStarNode<T>):number
    {
        var central = this.Ceil.GetCentralPoint();
        var central2 = node.Ceil.GetCentralPoint();

        return Math.sqrt(Math.pow(central2.X - central.X,2)) 
            + Math.sqrt(Math.pow(central2.Y - central.Y,2));
    }

    GetCost():number{
        return this.EstimatedGoalCost+this.FromStartCost;
    }
}