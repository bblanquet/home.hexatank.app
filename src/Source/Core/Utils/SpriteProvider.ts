import { PlaygroundHelper } from './PlaygroundHelper';
import { ISpriteProvider } from "./ISpriteProvider";
import { Archive } from "./ResourceArchiver";
import * as PIXI from 'pixi.js';

export class SpriteProvider implements ISpriteProvider{
    private _zoomInSvgDictionary:{ [id: string]: PIXI.Sprite; };
    private _zoomOutSvgDictionary:{ [id: string]: PIXI.Sprite; };

    constructor(){
        this._zoomInSvgDictionary = {};
        this._zoomOutSvgDictionary = {};
    }

    public GetZoomOutSprite(name: string): PIXI.Sprite 
    {
        if(this.IsOldStyleSvg(name))
        {
            const postension = './out'
            name = name.slice(1);
            name = postension + name;

            if(this._zoomOutSvgDictionary[name] === null){
                return this._zoomOutSvgDictionary[name];
            }
            else
            {
                const texture = PIXI.Sprite.from(name);
                this._zoomOutSvgDictionary[name] = texture;
                return texture;
            }
        }
        else
        {
            throw Error("nothing");// new PIXI.Sprite();//this._textureDictionary[name]
        }
    }

    public PreloadTexture(): void {
        this.LoadArchive(Archive,'./out',0.5,this._zoomOutSvgDictionary);
        //this.LoadArchive(Archive,'./in',1,this._zoomInSvgDictionary);
        // let container = new PIXI.Container();
        // container.parent = PlaygroundHelper.App.stage; 
        // for(let key in this._zoomOutSvgDictionary){
        //     container.addChild(this._zoomOutSvgDictionary[key]);
        //     //container.addChild(this._zoomInSvgDictionary[key]);
        // }
        // PlaygroundHelper.App.stage.addChild(container);
        // for (var i = PlaygroundHelper.App.stage.children.length - 1; i >= 0; i--) {	PlaygroundHelper.App.stage.removeChild(PlaygroundHelper.App.stage.children[i]);};
    
    }

    private LoadArchive(value:any,postension:string,accuracy:number,dictionary:{ [id: string]: PIXI.Sprite; }){
        if(typeof value === "string"){
            let name = postension + value.slice(1);
            const texture = PIXI.Sprite.from(name);
            dictionary[name] = texture;
        }
        else if(value instanceof Array){
            const filenames = value as Array<string>;
            filenames.forEach(filename=>{
                let name = postension + filename.slice(1);
                const texture = PIXI.Sprite.from(name);
                //.Texture.fromImage(name,undefined,undefined,accuracy);
                dictionary[name] = texture;
            });
        }
        else{
            for(let key in value){
                this.LoadArchive(value[key],postension,accuracy,dictionary);
            }
        }
    }

    public GetZoomInSprite(name: string): PIXI.Sprite 
    {
        if(this.IsOldStyleSvg(name))
        {
            const postension = './in'
            name = name.slice(1);
            name = postension + name;
            if(this._zoomInSvgDictionary[name] === null){
                return this._zoomInSvgDictionary[name];
            }
            else
            {
                const texture = PIXI.Sprite.from(name);
                this._zoomInSvgDictionary[name] = texture;
                return texture;
            }
        }
        else
        {
            throw Error("nothing");// new PIXI.Sprite();//this._textureDictionary[name]
        }   
    }

    private IsOldStyleSvg(name: string):boolean {
        return name.includes('.svg');
    }
}