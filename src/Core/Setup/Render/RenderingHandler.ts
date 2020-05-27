import * as PIXI from 'pixi.js';
import { RenderingGroups } from './RenderingGroups';
import { Item } from '../../Items/Item';

export class RenderingHandler {
	private _groups: RenderingGroups;

	constructor(groupsContainer: RenderingGroups) {
		this._groups = groupsContainer;
	}

	public Add(item: Item) {
		const all = item.GetDisplayObjects();
		const sprites = all.filter((i) => i instanceof PIXI.Sprite);
		const others = all.filter((i) => !(i instanceof PIXI.Sprite));

		sprites.forEach((sprite) => {
			this._groups.Z[item.Z].addChild(sprite);
		});

		others.forEach((sprite) => {
			this._groups.Z[4].addChild(sprite);
		});
	}

	public AddByGroup(shape: PIXI.DisplayObject, group: number): void {
		this._groups.Z[group].addChild(shape);
	}

	public Remove(item: Item) {
		item.GetDisplayObjects().forEach((sprite) => {
			sprite.alpha = 1;
			sprite.destroy();
			this._groups.Z[item.Z].removeChild(sprite);
		});
		item.Clear();
	}

	public Clear(): void {
		this._groups.Clear();
	}
}
