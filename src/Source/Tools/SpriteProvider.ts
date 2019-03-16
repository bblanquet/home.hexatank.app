import { ISpriteProvider } from "./ISpriteProvider";

export class SpriteProvider implements ISpriteProvider{
    private _textureDictionary:PIXI.loaders.TextureDictionary;
    private _zoomInSvgDictionary:{ [id: string]: PIXI.Texture; };
    private _zoomOutSvgDictionary:{ [id: string]: PIXI.Texture; };

    constructor(texture:PIXI.loaders.TextureDictionary){
        this._textureDictionary = texture;
        this._zoomInSvgDictionary = {};
        this._zoomOutSvgDictionary = {};
    }

    GetZoomOutSprite(name: any): PIXI.Sprite 
    {
        if(this.IsOldStyleSvg(name))
        {
            if(this._zoomOutSvgDictionary[name] === null){
                return new PIXI.Sprite(this._zoomOutSvgDictionary[name]);
            }
            else
            {
                PIXI.Texture.removeTextureFromCache(name);
                var texture = PIXI.Texture.fromImage(name,undefined,undefined,0.5);
                this._zoomOutSvgDictionary[name] = texture;
                return new PIXI.Sprite(texture);
            }
        }
        else
        {
            return new PIXI.Sprite(this._textureDictionary[name]);
        }
    }

    GetZoomInSprite(name: any): PIXI.Sprite 
    {
        if(this.IsOldStyleSvg(name))
        {
            if(this._zoomInSvgDictionary[name] === null){
                return new PIXI.Sprite(this._zoomInSvgDictionary[name]);
            }
            else
            {
                PIXI.Texture.removeTextureFromCache(name);
                var texture = PIXI.Texture.fromImage(name,undefined,undefined,1);
                this._zoomInSvgDictionary[name] = texture;
                return new PIXI.Sprite(texture);
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