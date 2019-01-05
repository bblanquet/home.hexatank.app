import { IPatternChecker } from "./IPatternChecker";
import { Item } from "../Item";
import { ICombination } from "./ICombination";
import { TruckCombination } from "./TruckCombination";
import { TankCombination } from "./TankCombination";
import { PatrolCombination } from "./PatrolCombination";
import { FastCeilCombination } from "./FastCeilCombination";

export class PatternChecker implements IPatternChecker{
    private _combinations:Array<ICombination>;
    
    constructor(){
        this._combinations = [
            new TruckCombination(),
            new TankCombination(),
            new PatrolCombination(),
            new FastCeilCombination()];
    }

    Check(items: Item[]):void {
        this._combinations.forEach(combination=>{
            combination.Combine(items);
        });
    }

}