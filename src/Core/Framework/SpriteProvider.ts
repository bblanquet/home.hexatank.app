import { LiteEvent } from './../Utils/Events/LiteEvent';
import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { SpriteAccuracy } from './SpriteAccuracy';
import * as PIXI from 'pixi.js';
import { Archive } from './ResourceArchiver';

export class SpriteProvider {
	constructor() {}

	private static _svgs: Dictionnary<PIXI.resources.SVGResource> = new Dictionnary<PIXI.resources.SVGResource>();

	public static GetSprite(name: string): PIXI.Sprite {
		const otpions = { resourceOptions: { scale: this.GetNumber(name) } };
		return new PIXI.Sprite(PIXI.Texture.from(`${SpriteAccuracy.high}${this.GetPath(name)}`, otpions));
	}

	private static GetNumber(sprite: string): number {
		if (
			[
				this.GetPath(Archive.menu.smartMenu.tankSelection),
				this.GetPath(Archive.menu.smartMenu.hoverTankSelection),
				this.GetPath(Archive.menu.smartMenu.cellSelection),
				this.GetPath(Archive.menu.smartMenu.hoverCellSelection)
			].some((e) => sprite === e)
		) {
			return 1;
		} else {
			return 0.3;
		}
	}

	public static LoadAll(): LiteEvent<number> {
		const event = new LiteEvent<number>();
		const assets = this.Assets();
		const threshold = 20;
		let loaded = 0;
		const total = assets.length;

		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
		PIXI.settings.RENDER_OPTIONS.antialias = false;
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
		[ SpriteAccuracy.high ].forEach((accuracy) => {
			SpriteProvider.GetAssets().forEach((name) => {
				assets.push(new AssetData(accuracy, name));
			});
		});
		return assets;
	}

	private static LoadAsset(data: AssetData, callBack: () => void) {
		const res = new PIXI.resources.SVGResource(data.Name, { scale: data.Acc });
		const key = data.ToString();
		const otpions = { resourceOptions: { scale: SpriteProvider.GetNumber(data.Name) } };
		let texture = new PIXI.Texture(new PIXI.BaseTexture(data.Name, otpions));
		texture.baseTexture.once('loaded', () => {
			callBack();
		});
		PIXI.BaseTexture.addToCache(texture.baseTexture, key);
		PIXI.Texture.addToCache(texture, key);
		this._svgs.Add(key, res);
	}

	private static GetAssets(): string[] {
		const keys = new Array<string>();
		this.GetPaths(Archive, keys);
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

	private static GetPath(asset: string): string {
		let path = asset;
		path = path.slice(1); //remove dot
		path = `.{{pos}}` + path;
		path = path.replace('//', '/');
		return path;
	}
}

export class AssetData {
	constructor(public Acc: SpriteAccuracy, public Name: string) {}
	public ToString(): string {
		return `${this.Acc}${this.Name}`;
	}
}
