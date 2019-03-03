import { PlaygroundHelper } from "./PlaygroundHelper";

export class HqSkin{
    constructor(private _tankBottom:string,private _tankTop:string,private _truck:string,private _color:string,private _ceil:string){

    }

    public GetTopTankSprite():PIXI.Sprite{
        return PlaygroundHelper.SpriteProvider.GetSprite(this._tankTop);
    }

    public GetBottomTankSprite():PIXI.Sprite{
        return PlaygroundHelper.SpriteProvider.GetSprite(this._tankBottom);
    }

    public GetTruck():PIXI.Sprite{
        return PlaygroundHelper.SpriteProvider.GetSprite(this._truck);
    }

    public GetColor():PIXI.Sprite{
        return PlaygroundHelper.SpriteProvider.GetSprite(this._color);
    }

    public GetCeil():PIXI.Sprite{
        return PlaygroundHelper.SpriteProvider.GetSprite(this._ceil);
    }

}