import * as PIXI from 'pixi.js';

export interface ISpriteProvider{
    GetZoomOutSprite(name:string,accuracy:number):PIXI.Sprite;
    GetZoomInSprite(name:string,accuracy:number):PIXI.Sprite;
    GetPaths():string[]; 
}