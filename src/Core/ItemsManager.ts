import { GameSettings } from './Framework/GameSettings';
import { IItemsManager } from './IItemsManager';
import { Item } from './Items/Item';
import { GameHelper } from './Framework/GameHelper';
import { IInteractionContext } from './Interaction/IInteractionContext';
import { ScaleHandler } from './Framework/ScaleHandler';

export class ItemsManager implements IItemsManager {
	Items: Array<Item>;

	constructor(private _scaleHandler: ScaleHandler) {
		this.Items = new Array<Item>();
	}

	public Select(event: IInteractionContext): void {
		for (let index = 0; index < this.Items.length; index++) {
			if (this.Items[index].Select(event)) {
				return;
			}
		}
		event.OnSelect(null);
	}

	public Update(): void {
		if (!GameSettings.IsPause) {
			this.Items = this.Items.filter((item) => item.IsUpdatable);
			this.Items.forEach((item) => {
				item.Update(this._scaleHandler.GetX(), this._scaleHandler.GetY());
			});
		}
	}
}
