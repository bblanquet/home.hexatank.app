import { ISpriteProvider } from "./ISpriteProvider";

export class SpriteProvider implements ISpriteProvider{
    private _textureDictionary:PIXI.loaders.TextureDictionary;
    constructor(texture:PIXI.loaders.TextureDictionary){
        this._textureDictionary = texture;
    }
    
    public GetSprite(name: any): PIXI.Sprite {
        if(this.IsOldStyleSvg(name))
        {
            var texture = PIXI.Texture.fromImage(name,undefined,undefined,2);
            return new PIXI.Sprite(texture);
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