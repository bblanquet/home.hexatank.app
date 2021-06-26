import { Dictionary } from '../Utils/Collections/Dictionary';
import { SpriteProvider } from './SpriteProvider';

export class SpriteManager {
	private _sprites: Dictionary<PIXI.Sprite>;
	private _destroyed: boolean = false;

	constructor() {
		this._sprites = new Dictionary<PIXI.Sprite>();
	}

	public Destroyed(): void {
		this._destroyed = true;
	}

	public GetCurrentSprites(): Dictionary<PIXI.Sprite> {
		return this._sprites;
	}

	public SetProperty(name: string, func: (sprite: PIXI.Sprite) => void) {
		func(this._sprites.Get(name));
	}

	public SetProperties(names: string[], func: (sprite: PIXI.Sprite) => void) {
		names.forEach((name) => this.SetProperty(name, func));
	}

	public AddSprite(name: string, sprite: PIXI.Sprite, func?: (sprite: PIXI.Sprite) => void) {
		if (func) {
			func(sprite);
		}
		this._sprites.Add(name, sprite);
	}

	public GenerateSprite(name: string, func?: (sprite: PIXI.Sprite) => void) {
		const sprite = SpriteProvider.GetSprite(name);

		if (func) {
			func(sprite);
		}
		this._sprites.Add(name, sprite);
	}

	public Update(): void {
		this._sprites.Keys().forEach((s) => {
			const current = this._sprites.Get(s);
			const next = this._sprites.Get(s);
			next.visible = current.visible;
			current.visible = false;
		});
	}

	public GetAll(): Array<PIXI.Sprite> {
		const result = new Array<PIXI.Sprite>();
		if (this._destroyed) {
			return result;
		}
		return this._sprites.Values();
	}
}
