import { Ceil } from "../../Ceil";
import { isNullOrUndefined } from "util";

export class TroopDestination{
    
    constructor(public Destination:Ceil,public Path:Array<Ceil>){
    }

    public GetCost():number{
        if(isNullOrUndefined(this.Path)){
            return 1000;
        }
        return this.Path.length;
    }
    
}