import { IPatternChecker } from "./IPatternChecker";
import { Item } from "../Item";
import { ICombination } from "./Combination/ICombination";
import { TruckCombination } from "./Combination/TruckCombination";
import { TankCombination } from "./Combination/TankCombination";
import { PatrolCombination } from "./Combination/PatrolCombination";
import { FastCeilCombination } from "./Combination/FastCeilCombination";
import { HealCeilCombination } from "./Combination/HealCeilCombination";
import { AttackCeilCombination } from "./Combination/AttackCeilCombination";

export class PatternChecker implements IPatternChecker{
    private _combinations:Array<ICombination>;
      
    constructor(){
        this._combinations = [
            new TruckCombination(),
            new TankCombination(),
            new PatrolCombination(),
            new FastCeilCombination(),
            new AttackCeilCombination(),
            new HealCeilCombination()];
    }

    Check(items: Item[]):void {
        this._combinations.forEach(combination=>{
            combination.Combine(items);
        });
    }

}