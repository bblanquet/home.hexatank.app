import * as PIXI from 'pixi.js';

export class SpriteProvider {
	private static _isLoaded: boolean = false;
	public static IsLoaded(): boolean {
		return this._isLoaded;
	}

	public static SetLoaded(isLoaded: boolean): void {
		this._isLoaded = isLoaded;
	}

	public static GetSprite(name: string): PIXI.Sprite {
		const otpions = { resourceOptions: { scale: 0.3 } };
		return new PIXI.Sprite(PIXI.Texture.from(this.GetPath(name), otpions));
	}
	private static GetPath(asset: string): string {
		let path = asset;
		path = path.slice(1); //remove dot
		path = this.GetAssetPath() + path;
		path = path.replace('//', '/');
		return path;
	}

	private static GetAssetPath() {
		return `{{asset_path}}`;
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
}
