import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import * as PIXI from 'pixi.js';
import { Item } from '../../Items/Item';

export class RenderingLayers {
	private _layers: Dictionnary<PIXI.Container>;
	constructor(stage: PIXI.Container, viewportStage: any) {
		this._layers = new Dictionnary<PIXI.Container>();
		[ -1, 0, 1, 2, 3, 4, 5 ].forEach((z) => {
			this._layers.Add(z.toString(), viewportStage);
		});
		[ 6, 7 ].forEach((z) => {
			this._layers.Add(z.toString(), stage);
		});
	}

	public Add(item: Item) {
		const all = item.GetAllDisplayable();
		const sprites = all.filter((i) => i instanceof PIXI.Sprite);
		const others = all.filter((i) => !(i instanceof PIXI.Sprite));

		sprites.forEach((sprite) => {
			this._layers.Get(item.Z.toString()).addChild(sprite);
		});

		others.forEach((other) => {
			this._layers.Get((4).toString()).addChild(other);
		});
	}

	public AddByGroup(shape: PIXI.DisplayObject, group: number): void {
		this._layers.Get(group.toString()).addChild(shape);
	}

	public Remove(item: Item) {
		item.GetAllDisplayable().forEach((sprite) => {
			sprite.alpha = 1;
			sprite.destroy();
			this._layers.Get((4).toString()).removeChild(sprite);
		});
		item.Clear();
	}

	public Clear(): void {
		this._layers.Clear();
	}
}
