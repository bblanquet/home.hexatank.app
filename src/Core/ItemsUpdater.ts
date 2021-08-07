import { LiteEvent } from '../Utils/Events/LiteEvent';
import { ViewContext } from '../Utils/Geometry/ViewContext';
import { IItemsUpdater } from './IItemsUpdater';
import { Item } from './Items/Item';
import { IInteractionContext } from './Interaction/IInteractionContext';
import { Env } from '../Utils/Env';
import { GameState } from './Framework/World/GameState';

export class ItemsUpdater implements IItemsUpdater {
	public OnError: LiteEvent<Error> = new LiteEvent<Error>();
	public Items: Array<Item> = new Array<Item>();
	public ViewContext: ViewContext;
	public static UpdateSpan: number = 15;
	private _lastUpdate: number = undefined;
	constructor(private _state: GameState) {
		this.ViewContext = new ViewContext();
	}

	public Select(event: IInteractionContext): void {
		this.Items.some((item) => item.Select(event));
	}

	public Update(): void {
		this.CalculateUpdateDuration();
		if (!this._state.IsPause()) {
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

	private CalculateUpdateDuration() {
		if (this._lastUpdate) {
			const nextUpdate = Date.now();
			ItemsUpdater.UpdateSpan = nextUpdate - this._lastUpdate;
			this._lastUpdate = nextUpdate;
		}
	}

	private Iterate() {
		this.Items = this.Items.filter((item) => item.IsUpdatable);
		this.Items.forEach((item) => {
			item.Update();
		});
	}
}
