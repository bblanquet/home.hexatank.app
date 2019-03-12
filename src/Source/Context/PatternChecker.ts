import { IPatternChecker } from "./IPatternChecker";
import { Item } from "../Item";
import { ICombination } from "./Combination/ICombination";


export class PatternChecker implements IPatternChecker{
    private _combinations:Array<ICombination>;
      
    constructor(combinations:Array<ICombination>){
        this._combinations = combinations;
    }

    Check(items: Item[]):void {
        this._combinations.some(combination=>{
            if(combination.Combine(items)){
                this._combinations.forEach(comb=>{
                    comb.Clear();
                })
                return true;
            }
            return false;
        });
    }

}