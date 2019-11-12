import { IListenersContainer } from "./IListenersContainer";
import { ICombination } from "./Combination/ICombination";
import { CombinationContext } from "./Combination/CombinationContext";

export class PatternChecker implements IListenersContainer{
    private _combinations:Array<ICombination>;
      
    constructor(combinations:Array<ICombination>){
        this._combinations = combinations;
    }

    Check(context: CombinationContext):void {
        this._combinations.some(combination=>{
            if(combination.Combine(context)){
                this._combinations.forEach(comb=>{
                    comb.Clear();
                })
                return true;
            }
            return false;
        });
    }

}