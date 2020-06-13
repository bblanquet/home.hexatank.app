import { SpriteAccuracy } from './SpriteAccuracy';
import * as PIXI from 'pixi.js';

export class SpriteProvider {
	constructor() {}

	public static GetSprite(name: string, accuracy: SpriteAccuracy): PIXI.Sprite {
		const svgResource = new PIXI.resources.SVGResource(this.GetPath(name));
		return new PIXI.Sprite(
			PIXI.Texture.from(svgResource.svg, { resourceOptions: { scale: this.GetNumber(accuracy) } })
		);
	}

	private static GetNumber(accuracy: SpriteAccuracy): number {
		switch (accuracy) {
			case SpriteAccuracy.high:
				return 0.5;
			case SpriteAccuracy.medium:
				return 0.2;
			case SpriteAccuracy.low:
				return 0.1;
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
