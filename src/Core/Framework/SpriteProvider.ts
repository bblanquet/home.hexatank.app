import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { SpriteAccuracy } from './SpriteAccuracy';
import * as PIXI from 'pixi.js';

export class SpriteProvider {
	constructor() {}

	private static _svgs: Dictionnary<PIXI.resources.SVGResource> = new Dictionnary<PIXI.resources.SVGResource>();

	public static GetSprite(name: string, accuracy: SpriteAccuracy): PIXI.Sprite {
		this.GetSvgResource(name, accuracy);
		const otpions = { resourceOptions: { scale: this.GetNumber(accuracy) } };
		return new PIXI.Sprite(PIXI.Texture.from(`${accuracy}${name}`, otpions));
	}

	private static GetSvgResource(name: string, accuracy: SpriteAccuracy): PIXI.resources.SVGResource {
		const key = `${accuracy}${name}`;
		if (this._svgs.Exist(key)) {
			return this._svgs.Get(key);
		} else {
			const res = new PIXI.resources.SVGResource(this.GetPath(name), { scale: accuracy });
			this._svgs.Add(key, res);
			const otpions = { resourceOptions: { scale: this.GetNumber(accuracy) } };
			let texture = new PIXI.Texture(new PIXI.BaseTexture(res.svg, otpions));
			PIXI.BaseTexture.addToCache(texture.baseTexture, `${accuracy}${name}`);
			PIXI.Texture.addToCache(texture, `${accuracy}${name}`);
			return res;
		}
	}

	private static GetNumber(accuracy: SpriteAccuracy): number {
		switch (accuracy) {
			case SpriteAccuracy.low:
				return 0.1;
			case SpriteAccuracy.medium:
				return 0.25;
			case SpriteAccuracy.mediumHigh:
				return 0.5;
			case SpriteAccuracy.high:
				return 0.8;
		}
	}

	private static GetPath(asset: string): string {
		let path = asset;
		path = path.slice(1); //remove dot
		path = `.{{}}` + path;
		path = path.replace('//', '/');
		return path;
	}
}
