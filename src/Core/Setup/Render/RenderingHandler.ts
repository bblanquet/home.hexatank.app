import * as PIXI from 'pixi.js';
import { RenderingGroups } from './RenderingGroups';
import { Item } from '../../Items/Item';

export class RenderingHandler {
	private _groups: RenderingGroups;

	constructor(groupsContainer: RenderingGroups) {
		this._groups = groupsContainer;
	}

	public Add(item: Item) {
		item.GetDisplayObjects().forEach((sprite) => {
			this._groups.Z[item.Z].addChild(sprite);
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
