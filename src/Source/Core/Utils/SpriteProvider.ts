import { ISpriteProvider } from "./ISpriteProvider";
import { Archive } from "./ResourceArchiver";
import * as PIXI from 'pixi.js';

export class SpriteProvider implements ISpriteProvider{
    private _textureDictionary:PIXI.loaders.TextureDictionary;
    private _zoomInSvgDictionary:{ [id: string]: PIXI.Sprite; };
    private _zoomOutSvgDictionary:{ [id: string]: PIXI.Sprite; };

    constructor(texture:PIXI.loaders.TextureDictionary){
        this._textureDictionary = texture;
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
            return new PIXI.Sprite(this._textureDictionary[name]);
        }
    }

    public PreloadTexture(): void {
        this.LoadInArchive(Archive,'./out',0.5);
        this.LoadInArchive(Archive,'./in',1);
    }

    private LoadInArchive(value:any,postension:string,accuracy:number){
        if(typeof value === "string"){
            let name = postension + value.slice(1);
            const texture = PIXI.Sprite.from(name);
            this._zoomOutSvgDictionary[name] = texture;
        }
        else if(value instanceof Array){
            const filenames = value as Array<string>;
            filenames.forEach(filename=>{
                let name = postension + filename.slice(1);
                const texture = PIXI.Sprite.from(name);
                //.Texture.fromImage(name,undefined,undefined,accuracy);
                this._zoomOutSvgDictionary[name] = texture;
            });
        }
        else{
            for(let key in value){
                this.LoadInArchive(value[key],postension,accuracy);
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
            return new PIXI.Sprite(this._textureDictionary[name]);
        }   
    }

    private IsOldStyleSvg(name: string):boolean {
        return name.includes('.svg');
    }
}