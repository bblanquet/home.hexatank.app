import { ViewContext } from './Utils/Geometry/ViewContext';
import { GameSettings } from './Framework/GameSettings';
import { IItemsUpdater } from './IItemsUpdater';
import { Item } from './Items/Item';
import { IInteractionContext } from './Interaction/IInteractionContext';

export class ItemsUpdater implements IItemsUpdater {
	Items: Array<Item>;

	constructor(public ViewContext: ViewContext) {
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
				item.Update(this.ViewContext.GetX(), this.ViewContext.GetY());
			});
		}
	}
}
