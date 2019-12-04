import { ISpriteProvider } from "./ISpriteProvider";
import { Archive } from "./ResourceArchiver";
import * as PIXI from 'pixi.js';

export class SpriteProvider implements ISpriteProvider{

    constructor(){
    }

    public GetZoomOutSprite(name: string,accuracy:number): PIXI.Sprite 
    {
        if(this.IsSvg(name))
        {
            const postension = './out'
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
            const postension = './in'
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

    public GetPaths(): string[] {
        const outKeys = new Array<string>();
        const inKeys = new Array<string>();
        this.GetAssetPaths(Archive,'./out', outKeys);
        this.GetAssetPaths(Archive,'./in', inKeys);
        inKeys.forEach(inkey=>{
            outKeys.push(inkey);
        })
        return outKeys;
    } 

    private GetAssetPaths(value:any,postension:string,keys:string[]){
        if(typeof value === "string")
        {
            keys.push(postension + value.slice(1));
        }
        else if(value instanceof Array)
        {
            const filenames = value as Array<string>;
            filenames.forEach(filename=>{
                keys.push(postension + filename.slice(1));
            });
        }
        else
        {
            for(let key in value){
                this.GetAssetPaths(value[key],postension,keys);
            }
        }
    }

}