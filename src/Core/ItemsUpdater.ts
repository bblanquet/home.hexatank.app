import { LiteEvent } from './Utils/Events/LiteEvent';
import { ViewContext } from './Utils/Geometry/ViewContext';
import { GameSettings } from './Framework/GameSettings';
import { IItemsUpdater } from './IItemsUpdater';
import { Item } from './Items/Item';
import { IInteractionContext } from './Interaction/IInteractionContext';
import { Env } from '../Env';

export class ItemsUpdater implements IItemsUpdater {
	public OnError: LiteEvent<Error> = new LiteEvent<Error>();
	public Items: Array<Item> = new Array<Item>();
	public ViewContext: ViewContext;
	public static UpdateSpan: number = 15;
	private _lastUpdate: number = undefined;
	constructor() {
		this.ViewContext = new ViewContext();
	}

	public Select(event: IInteractionContext): void {
		this.Items.some((item) => item.Select(event));
	}

	public Update(): void {
		if (this._lastUpdate) {
			const nextUpdate = Date.now();
			ItemsUpdater.UpdateSpan = nextUpdate - this._lastUpdate;
			this._lastUpdate = nextUpdate;
		}
		if (!GameSettings.IsPausing()) {
			if (Env.IsPrd()) {
				try {
					this.Iterate();
				} catch (e) {
					if (e instanceof Error) {
						this.OnError.Invoke(this, e);
					}
				}
			} else {
				this.Iterate();
			}
		}
	}

	private Iterate() {
		this.Items = this.Items.filter((item) => item.IsUpdatable);
		this.Items.forEach((item) => {
			item.Update(this.ViewContext.GetX(), this.ViewContext.GetY());
		});
	}
}
