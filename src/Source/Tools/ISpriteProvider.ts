export interface ISpriteProvider{
    GetZoomOutSprite(name:string):PIXI.Sprite;
    GetZoomInSprite(name:string):PIXI.Sprite;
    PreloadTexture():void;
}