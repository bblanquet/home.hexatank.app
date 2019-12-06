import { ISpriteProvider } from "./ISpriteProvider";
import * as PIXI from 'pixi.js';

export class SpriteProvider implements ISpriteProvider{

    constructor(){
    }

    public GetZoomOutSprite(name: string,accuracy:number): PIXI.Sprite 
    {
        if(this.IsSvg(name))
        {
            const postension = `.{{}}out`
            name = name.slice(1);
            name = postension + name; 

            return new PIXI.Sprite(PIXI.Texture.fromImage(name,undefined,undefined,accuracy));
        }
        else
        {
            throw Error("asset not found");
        }
    }

    public GetZoomInSprite(name: string,accuracy:number): PIXI.Sprite 
    {
        if(this.IsSvg(name))
        {
            const postension = `.{{}}in`
            name = name.slice(1);
            name = postension + name;
            return new PIXI.Sprite(PIXI.Texture.fromImage(name,undefined,undefined,accuracy));
        }
        else
        {
            throw Error("nothing");
        }    
    } 

    private IsSvg(name: string):boolean {
        return name.includes('.svg');
    }

}