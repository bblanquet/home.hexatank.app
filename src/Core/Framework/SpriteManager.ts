import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { SpriteProvider } from './SpriteProvider';

export class SpriteManager {
	private _sprites: Dictionnary<PIXI.Sprite>;
	private _destroyed: boolean = false;

	constructor() {
		this._sprites = new Dictionnary<PIXI.Sprite>();
	}

	public Destroyed(): void {
		this._destroyed = true;
	}

	public GetCurrentSprites(): Dictionnary<PIXI.Sprite> {
		return this._sprites;
	}

	public SetProperty(name: string, func: (sprite: PIXI.Sprite) => void) {
		func(this._sprites.Get(name));
	}

	public SetProperties(names: string[], func: (sprite: PIXI.Sprite) => void) {
		names.forEach((name) => this.SetProperty(name, func));
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
