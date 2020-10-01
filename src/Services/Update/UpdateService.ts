import { ItemsUpdater } from '../../Core/ItemsUpdater';
import { IUpdateService } from './IUpdateService';
import { logType } from '../../Factory';
export class UpdateService implements IUpdateService {
	private _itemsUpdater: ItemsUpdater;
	@logType private plop: IUpdateService;

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
