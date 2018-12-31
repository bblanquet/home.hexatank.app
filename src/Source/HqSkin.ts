import { PlaygroundHelper } from "./PlaygroundHelper";

export class HqSkin{
    constructor(private _tankBottom:string,private _tankTop:string,private _truck:string,private _color:number){

    }

    public GetTopTankSprite():PIXI.Sprite{
        return new PIXI.Sprite(PlaygroundHelper.Render.Textures[this._tankTop]);
    }

    public GetBottomTankSprite():PIXI.Sprite{
        return new PIXI.Sprite(PlaygroundHelper.Render.Textures[this._tankBottom]);
    }

    public GetTruck():PIXI.Sprite{
        return new PIXI.Sprite(PlaygroundHelper.Render.Textures[this._truck]);
    }

    public GetColor():number{
        return this._color;
    }

}