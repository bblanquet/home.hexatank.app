import { LiteEvent } from './Utils/Events/LiteEvent';
import { ViewContext } from './Utils/Geometry/ViewContext';
import { GameSettings } from './Framework/GameSettings';
import { IItemsUpdater } from './IItemsUpdater';
import { Item } from './Items/Item';
import { IInteractionContext } from './Interaction/IInteractionContext';

export class ItemsUpdater implements IItemsUpdater {
	public OnError: LiteEvent<Error> = new LiteEvent<Error>();
	public Items: Array<Item> = new Array<Item>();
	public ViewContext: ViewContext;
	constructor() {
		this.ViewContext = new ViewContext();
	}

	public Select(event: IInteractionContext): void {
		this.Items.some((item) => item.Select(event));
	}

	public Update(): void {
		if (!GameSettings.IsPause) {
			this.Items = this.Items.filter((item) => item.IsUpdatable);
			this.Items.forEach((item) => {
				item.Update(this.ViewContext.GetX(), this.ViewContext.GetY());
			});
			// try {
			// 	this.Items = this.Items.filter((item) => item.IsUpdatable);
			// 	this.Items.forEach((item) => {
			// 		item.Update(this.ViewContext.GetX(), this.ViewContext.GetY());
			// 	});
			// } catch (e) {
			// 	if (e instanceof Error) {
			// 		this.OnError.Invoke(this, e);
			// 	}
			// }
		}
	}
}
