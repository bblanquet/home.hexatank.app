import { LiteEvent } from './../../Utils/Events/LiteEvent';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import * as PIXI from 'pixi.js';
import { SvgArchive } from './SvgArchiver';

export class SpriteProvider {
	private static _isLoaded: boolean = false;
	public static IsLoaded(): boolean {
		return this._isLoaded;
	}

	public static SetLoaded(isLoaded: boolean): void {
		this._isLoaded = isLoaded;
	}

	private static _svgs: Dictionary<PIXI.resources.SVGResource> = new Dictionary<PIXI.resources.SVGResource>();

	public static GetSprite(name: string): PIXI.Sprite {
		const otpions = { resourceOptions: { scale: 0.3 } };
		return new PIXI.Sprite(PIXI.Texture.from(this.GetPath(name), otpions));
	}

	public static LoadAll(): LiteEvent<number> {
		const event = new LiteEvent<number>();
		const assets = this.Assets();
		const threshold = 200;
		let loaded = 0;
		const total = assets.length;

		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
		PIXI.settings.RENDER_OPTIONS.antialias = true;
		PIXI.settings.TARGET_FPMS = PIXI.TARGETS.TEXTURE_2D;

		SpriteProvider.LoadByPeriod(assets, threshold, loaded, event, total);
		return event;
	}

	private static LoadByPeriod(
		assets: AssetData[],
		threshold: number,
		loaded: number,
		event: LiteEvent<number>,
		total: number
	): void {
		SpriteProvider.LoadByThreshold(assets, threshold, () => {
			loaded += 1;
			event.Invoke(this, loaded * 100 / total);

			if (loaded % threshold === 0 && assets.length > 0) {
				this.LoadByPeriod(assets, threshold, loaded, event, total);
			}
		});
	}

	private static LoadByThreshold(assets: Array<AssetData>, threshold: number, callBack: () => void) {
		let i = 0;
		while (i < threshold) {
			if (assets.length === 0) {
				return;
			} else {
				const candidate = assets.splice(0, 1);
				this.LoadAsset(candidate[0], callBack);
			}
			i += 1;
		}
	}

	private static Assets(): Array<AssetData> {
		const assets = new Array<AssetData>();
		const unique = new Set<string>();
		SpriteProvider.GetAssets().forEach((name) => {
			if (!unique.has(name)) {
				assets.push(new AssetData(name));
				unique.add(name);
			}
		});
		return assets;
	}

	private static LoadAsset(data: AssetData, callBack: () => void) {
		const res = new PIXI.resources.SVGResource(data.Source);
		const key = data.ToString();
		const otpions = { resourceOptions: { scale: 0.3 } };
		let texture = new PIXI.Texture(new PIXI.BaseTexture(data.Source, otpions));
		texture.baseTexture.once('loaded', () => {
			callBack();
		});
		PIXI.BaseTexture.addToCache(texture.baseTexture, key);
		PIXI.Texture.addToCache(texture, key);
		this._svgs.Add(key, res);
	}

	private static GetAssets(): string[] {
		const keys = new Array<string>();
		this.GetPaths(SvgArchive, keys);
		return keys;
	}

	private static GetPaths(value: any, keys: string[]) {
		if (typeof value === 'string') {
			keys.push(this.GetPath(value.slice(1)));
		} else if (value instanceof Array) {
			const filenames = value as Array<string>;
			filenames.forEach((filename) => {
				keys.push(this.GetPath(filename.slice(1)));
			});
		} else {
			for (let key in value) {
				this.GetPaths(value[key], keys);
			}
		}
	}

	private static GetSubPath() {
		return `{{subpath}}`;
	}

	public static AssetPath(): string {
		if (this.GetSubPath() !== this.GetAssetPath()) {
			return `{{asset_path}}`;
		}
		return '';
	}

	private static GetAssetPath() {
		return `{{asset_path}}`;
	}

	private static GetPath(asset: string): string {
		let path = asset;
		path = path.slice(1); //remove dot
		path = this.GetAssetPath() + path;
		path = path.replace('//', '/');
		return path;
	}
}

export class AssetData {
	constructor(public Source: string) {}
	public ToString(): string {
		return this.Source;
	}
}
