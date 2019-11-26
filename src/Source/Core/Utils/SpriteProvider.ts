import { PlaygroundHelper } from './PlaygroundHelper';
import { ISpriteProvider } from "./ISpriteProvider";
import { Archive } from "./ResourceArchiver";
import * as PIXI from 'pixi.js';

export class SpriteProvider implements ISpriteProvider{ 
    private _inDict:{ [id: string]: PIXI.Sprite; };
    private _outDict:{ [id: string]: PIXI.Sprite; };

    constructor(){
        this._inDict = {};
        this._outDict = {};
    }

    public GetZoomOutSprite(name: string,accuracy:number): PIXI.Sprite 
    {
        if(this.IsOldStyleSvg(name))
        {
            const postension = './out'
            name = name.slice(1);
            name = postension + name; 

            if(this._outDict[name] === null){
                return this._outDict[name];
            }
            else
            {
                const texture = new PIXI.Sprite(PIXI.Texture.fromImage(name,undefined,undefined,accuracy));
                this._outDict[name] = texture;
                return texture;
            }
        }
        else
        {
            throw Error("asset not found");
        }
    }

    public GetZoomInSprite(name: string,accuracy:number): PIXI.Sprite 
    {
        if(this.IsOldStyleSvg(name))
        {
            const postension = './in'
            name = name.slice(1);
            name = postension + name;
            if(this._inDict[name] === null){
                return this._inDict[name];
            }
            else
            {
                const texture = new PIXI.Sprite(PIXI.Texture.fromImage(name,undefined,undefined,accuracy));
                this._inDict[name] = texture;
                return texture;
            }
        }
        else
        {
            throw Error("nothing");
        }   
    }

    public PreloadTexture(): void {
        const outKeys = new Array<string>();
        const inKeys = new Array<string>();
        this.GetAssetPaths(Archive,'./out', outKeys);
        this.GetAssetPaths(Archive,'./in', inKeys);
        let container = new PIXI.Container();
         container.parent = PlaygroundHelper.App.stage; 
         for(let key in this._outDict){
             PIXI.loader.load()
             container.addChild(this._outDict[key]);
             container.addChild(this._inDict[key]);
         }
         PlaygroundHelper.App.stage.addChild(container);
         for (var i = PlaygroundHelper.App.stage.children.length - 1; i >= 0; i--) {	PlaygroundHelper.App.stage.removeChild(PlaygroundHelper.App.stage.children[i]);};
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