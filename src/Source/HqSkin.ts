import { PlaygroundHelper } from "./PlaygroundHelper";

export class HqSkin{
    constructor(private _tankBottom:string,private _tankTop:string,private _truck:string,private _color:string,private _ceil:string){

    }

    public GetTopTankSprite():string{
        return this._tankTop;
    }

    public GetBottomTankSprite():string{
        return this._tankBottom;
    }

    public GetTruck():string{
        return this._truck;
    }

    public GetHq():string{
        return this._color;
    }

    public GetCeil():string{
        return this._ceil;
    }

}