import { Ceil } from "../../Ceil";
import { isNullOrUndefined, isNull } from "util";
import { CeilState } from "../../CeilState";

export class Area{

    constructor(private _centerCeil:Ceil){
        //this._centerCeil.SetState(CeilState.Visible);
    }
 
    public GetCentralCeil():Ceil{
        return this._centerCeil;
    }

    public GetAvailableCeil():Ceil[]{
        return this._centerCeil.GetAllNeighbourhood().map(c => <Ceil>c).filter(c=>!isNullOrUndefined(c) && !c.IsBlocked());
    }
}