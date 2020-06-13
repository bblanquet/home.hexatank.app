import { Dictionnary } from './../Utils/Collections/Dictionnary';
import { SpriteProvider } from './SpriteProvider';
import { SpriteAccuracy } from './SpriteAccuracy';

export class SpriteManager {
	private _sprites: Dictionnary<Dictionnary<PIXI.Sprite>>;
	private _currentAcccuracy: SpriteAccuracy;

	constructor() {
		this._sprites = new Dictionnary<Dictionnary<PIXI.Sprite>>();
		this.Accuracies().forEach((a) => {
			this._sprites.Add(SpriteAccuracy[a], new Dictionnary<PIXI.Sprite>());
		});
		this._currentAcccuracy = SpriteAccuracy.high;
	}

	private Accuracies(): SpriteAccuracy[] {
		return [ SpriteAccuracy.low, SpriteAccuracy.medium, SpriteAccuracy.high ];
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
			if (func) {
				func(sprite);
			}
			this._sprites.Get(SpriteAccuracy[accuracy]).Add(name, sprite);
		});
	}

	public Update(accuracy: SpriteAccuracy): void {
		this._sprites.Get(SpriteAccuracy[this._currentAcccuracy]).Values().forEach((s) => {
			s.visible = false;
		});
		this._sprites.Get(SpriteAccuracy[accuracy]).Values().forEach((s) => {
			s.visible = true;
		});

		this._currentAcccuracy = accuracy;
	}

	public GetAll(): Array<PIXI.Sprite> {
		const result = new Array<PIXI.Sprite>();
		this._sprites.Values().forEach((list) => {
			list.Values().forEach((s) => {
				result.push(s);
			});
		});
		return result;
	}
}
