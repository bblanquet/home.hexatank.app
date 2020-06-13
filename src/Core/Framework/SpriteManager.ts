import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { SpriteProvider } from './SpriteProvider';
import { SpriteAccuracy } from './SpriteAccuracy';

export class SpriteManager {
	private _sprites: Dictionnary<Dictionnary<PIXI.Sprite>>;
	private _currentAcccuracy: SpriteAccuracy;
	private _destroyed: boolean = false;

	constructor() {
		this._sprites = new Dictionnary<Dictionnary<PIXI.Sprite>>();
		this.Accuracies().forEach((a) => {
			this._sprites.Add(SpriteAccuracy[a], new Dictionnary<PIXI.Sprite>());
		});
		this._currentAcccuracy = SpriteAccuracy.high;
	}

	public Destroyed(): void {
		this._destroyed = true;
	}

	private Accuracies(): SpriteAccuracy[] {
		return [ SpriteAccuracy.high, SpriteAccuracy.low, SpriteAccuracy.medium, SpriteAccuracy.mediumHigh ];
	}

	public GetCurrentSprites(): Dictionnary<PIXI.Sprite> {
		return this._sprites.Get(SpriteAccuracy[this._currentAcccuracy]);
	}

	public SetProperty(name: string, func: (sprite: PIXI.Sprite) => void) {
		this.Accuracies().forEach((accuracy) => {
			func(this._sprites.Get(SpriteAccuracy[accuracy]).Get(name));
		});
	}

	public SetProperties(names: string[], func: (sprite: PIXI.Sprite) => void) {
		names.forEach((name) => this.SetProperty(name, func));
	}

	public GenerateSprite(name: string, func?: (sprite: PIXI.Sprite) => void) {
		this.Accuracies().forEach((accuracy) => {
			const sprite = SpriteProvider.GetSprite(name, accuracy);
			sprite.visible = accuracy === this._currentAcccuracy;

			if (func) {
				func(sprite);
			}
			this._sprites.Get(SpriteAccuracy[accuracy]).Add(name, sprite);
		});
	}

	public Init(): void {
		this.Accuracies().forEach((accuracy) => {
			this._sprites.Get(SpriteAccuracy[accuracy]).Values().forEach((sprite) => {
				sprite.visible = accuracy === this._currentAcccuracy;
			});
		});
	}

	public Update(accuracy: SpriteAccuracy): void {
		this._sprites.Get(SpriteAccuracy[this._currentAcccuracy]).Keys().forEach((s) => {
			const current = this._sprites.Get(SpriteAccuracy[this._currentAcccuracy]).Get(s);
			const next = this._sprites.Get(SpriteAccuracy[accuracy]).Get(s);
			next.visible = current.visible;
			current.visible = false;
		});
		this._currentAcccuracy = accuracy;
	}

	public GetAll(): Array<PIXI.Sprite> {
		const result = new Array<PIXI.Sprite>();
		if (this._destroyed) {
			return result;
		}

		this._sprites.Values().forEach((list) => {
			list.Values().forEach((s) => {
				result.push(s);
			});
		});
		return result;
	}
}
