import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { IUpdateService } from './IUpdateService';
export class UpdateService implements IUpdateService {
	private _itemsUpdater: ItemsUpdater;

	Register(): void {
		this._itemsUpdater = new ItemsUpdater();
	}

	Publish(): ItemsUpdater {
		return this._itemsUpdater;
	}

	Collect(): void {
		this._itemsUpdater.Items.forEach((item) => {
			item.Destroy();
			item = null;
		});
		this._itemsUpdater.Items = [];
	}
}
