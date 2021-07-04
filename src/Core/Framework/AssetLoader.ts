import * as PIXI from 'pixi.js';
import { LiteEvent } from './../../Utils/Events/LiteEvent';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import { AssetExplorer } from './AssetExplorer';

export class AssetLoader {
	private _svgs: Dictionary<PIXI.resources.SVGResource> = new Dictionary<PIXI.resources.SVGResource>();
	private _threshold: number = 200;
	private _isLoaded: boolean = false;

	public Loaded(): boolean {
		return this._isLoaded;
	}

	public LoadAll(): LiteEvent<number> {
		const event = new LiteEvent<number>();
		const assets = new AssetExplorer().GetAssets();

		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
		PIXI.settings.RENDER_OPTIONS.antialias = true;
		PIXI.settings.TARGET_FPMS = PIXI.TARGETS.TEXTURE_2D;

		this.Load(assets, this._threshold, assets.length, 0, event);
		return event;
	}

	private Load(assets: string[], amount: number, total: number, loaded: number, event: LiteEvent<number>): void {
		const poppedAssets = this.Pop(assets, amount);
		const onLoaded = () => {
			loaded += 1;
			event.Invoke(this, loaded * 100 / total);

			if (this.IsFullyLoaded(assets)) {
				this._isLoaded = true;
			}

			if (this.IsLoaded(loaded, amount, assets)) {
				this.Load(assets, amount, total, loaded, event);
			}
		};
		poppedAssets.forEach((asset) => {
			this.LoadAsset(asset, onLoaded);
		});
	}

	private IsFullyLoaded(assets: string[]) {
		return assets.length === 0;
	}

	private IsLoaded(loaded: number, amount: number, assets: string[]) {
		return loaded % amount === 0 && 0 < assets.length;
	}

	private Pop(assets: Array<string>, threshold: number): string[] {
		const popCount = assets.length < threshold ? assets.length : threshold;
		return assets.splice(0, popCount);
	}

	private LoadAsset(path: string, onLoaded: () => void) {
		if (path.includes('.svg/Assets/UI/')) {
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
