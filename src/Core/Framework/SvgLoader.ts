import * as PIXI from 'pixi.js';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { ILoader } from './ILoader';

export class SvgLoader implements ILoader {
	private _svgs: Dictionary<PIXI.resources.SVGResource> = new Dictionary<PIXI.resources.SVGResource>();

	constructor() {
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
		PIXI.settings.RENDER_OPTIONS.antialias = true;
		PIXI.settings.TARGET_FPMS = PIXI.TARGETS.TEXTURE_2D;
	}

	public Loading(path: string, onLoaded: () => void) {
		if (path.includes('/UI/')) {
			new Image().src = path;
			onLoaded();
		} else {
			const res = new PIXI.resources.SVGResource(path);
			const key = path;
			const otpions = { resourceOptions: { scale: 0.3 } };
			let texture = new PIXI.Texture(new PIXI.BaseTexture(path, otpions));
			texture.baseTexture.once('loaded', () => {
				onLoaded();
			});
			PIXI.BaseTexture.addToCache(texture.baseTexture, key);
			PIXI.Texture.addToCache(texture, key);
			this._svgs.Add(key, res);
		}
	}
}
