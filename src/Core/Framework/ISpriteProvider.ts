import * as PIXI from 'pixi.js';

export interface ISpriteProvider {
	GetSprite(name: string, accuracy: number): PIXI.Sprite;
}
