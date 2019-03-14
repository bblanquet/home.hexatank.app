import { ISpriteProvider } from "./ISpriteProvider";

export class SpriteProvider implements ISpriteProvider{
    private _textureDictionary:PIXI.loaders.TextureDictionary;
    private _svgTextureDictionnary:{ [id: string]: PIXI.Texture; };

    constructor(texture:PIXI.loaders.TextureDictionary){
        this._textureDictionary = texture;
        this._svgTextureDictionnary = {};
    }
    
    public GetSprite(name: any): PIXI.Sprite {
        if(this.IsOldStyleSvg(name))
        {
            if(this._svgTextureDictionnary[name] === null){//name in
                return new PIXI.Sprite(this._svgTextureDictionnary[name]);
            }
            else
            {
                var texture = PIXI.Texture.fromImage(name,undefined,undefined,2);
                this._svgTextureDictionnary[name] = texture;
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