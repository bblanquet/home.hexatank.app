import { InteractionContext } from '../Interaction/InteractionContext';
import { MenuItem } from './MenuItem';
import { PlaygroundHelper } from '../Utils/PlaygroundHelper';

export class EmptyMenuItem extends MenuItem {
	constructor(private _item: string, hasToHide: boolean = true) {
		super();
		this.Z = 6;
		this.GenerateSprite(_item);
		if (hasToHide) {
			this.Hide();
		}
		PlaygroundHelper.Render.Add(this);
	}

	public Show(): void {
		this.SetProperty(this._item, (e) => (e.alpha = 1));
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}
}
