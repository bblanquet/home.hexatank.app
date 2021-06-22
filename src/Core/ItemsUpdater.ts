import { LiteEvent } from './Utils/Events/LiteEvent';
import { ViewContext } from './Utils/Geometry/ViewContext';
import { GameSettings } from './Framework/GameSettings';
import { IItemsUpdater } from './IItemsUpdater';
import { Item } from './Items/Item';
import { IInteractionContext } from './Interaction/IInteractionContext';
import * as luxon from 'luxon';

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
			// const e = new Array<{ d: number; n: string }>();
			this.Items = this.Items.filter((item) => item.IsUpdatable);
			// const allDate = luxon.DateTime.fromJSDate(new Date());
			this.Items.forEach((item) => {
				// const date = luxon.DateTime.fromJSDate(new Date());
				item.Update(this.ViewContext.GetX(), this.ViewContext.GetY());
				// const nextDate = luxon.DateTime.fromJSDate(new Date());
				// e.push({ d: nextDate.diff(date).toMillis(), n: item.constructor.name });
			});
			// const allNextDate = luxon.DateTime.fromJSDate(new Date());
			// if (30 < allNextDate.diff(allDate).toMillis()) {
			// 	console.log(`[ALL] ${allNextDate.diff(allDate).toMillis()} `);
			// 	const sort = e.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0)).reverse();
			// 	sort.some((a, i) => {
			// 		if (3 < i) {
			// 			return true;
			// 		}
			// 		console.log(`-> ${a.n} ${a.d} `);
			// 		return false;
			// 	});
			// }
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
